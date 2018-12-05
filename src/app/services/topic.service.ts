import { Injectable } from '@angular/core';
import { Topic } from './topic';
import { Participant } from './participant'
import { CarbonLDP } from 'carbonldp/CarbonLDP';
import { Document } from 'carbonldp/Document';
import { ConflictError } from 'carbonldp/HTTP/Errors';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  carbonldp: CarbonLDP;

  carbonUri: string;

  topicsRoot: string = "topics/";
  participantsRoot: string = "participants/";
  private topicAddedSource = new Subject<Topic & Document>();

  constructor() {
    this.carbonUri = environment.carbonldp.protocol + '://' + environment.carbonldp.host;
    // initialize your CarbonLDP object with the domain where your platform lives
    this.carbonldp = new CarbonLDP( this.carbonUri );


    this.carbonldp.extendObjectSchema( "Topic", {
        "participants": {
          "@container":"@set"
        }
    });
    this.carbonldp.extendObjectSchema( "Idea", {
       "likes": {
         "@container":"@set"
       },
       "dislikes": {
         "@container":"@set"
       }
    });
    this.carbonldp.extendObjectSchema( "Participant", {
      "firstName":"string",
      "lastName":"string",
      "email":"string",
      "passphrase":"string"
    });

  }

  getTopic(slug: string): Promise<Document & Topic> {
    let topicId:string = this.topicsRoot + slug + '/';
    let promise: Promise<Document & Topic> = new Promise<Document & Topic>((resolve, reject) => {
      this.carbonldp.documents.$get<Document & Topic>( topicId ).then(
        (topic: Topic & Document) => {
          topic.$resolve().then(
            (topic: Topic & Document) => {
              resolve(topic);
            }
          );
        }
      ).catch(error => reject(error));
    });
    return promise;
  }

  deleteTopic(topic: Document & Topic): Promise<any> {
    return topic.$delete();
  }

  listTopicDocuments() {
    let promise = new Promise((resolve, reject) => {
      this.carbonldp.documents.$getChildren<Topic>( this.topicsRoot ).then(
        ( topics:( Topic & Document )[] ) => {
          resolve(topics); // array of full documents
        }
      ).catch( error => { reject(error); });
    });
    return promise;
  }

  listTopics() {
    let promise = new Promise((resolve, reject) => {
      this.carbonldp.documents.$listChildren<Topic>( this.topicsRoot ).then(
        ( topics:( Topic & Document )[] ) => {
          resolve(topics); // array of shallow documents
        }
      ).catch( error => { reject(error); });
    });
    return promise;
  }

  topicAdded$ = this.topicAddedSource.asObservable();

  topicCreated(topic: Topic & Document) {
    this.topicAddedSource.next(topic);
  }

  createTopic(topicName: string, owner: any, participants?: any[]) {

    const topic: Topic = {
      name: topicName,
      owner: owner,
      participants: participants,
      types: [ "Topic" ]
    };

    let promise = new Promise((resolve, reject) => {

    this.carbonldp.documents.$create(this.topicsRoot, topic, this.makeFriendlySlug(topicName) ).then(
        ( topicDocument: Topic & Document ) => {
          this.topicCreated(topicDocument);
          resolve(topic);
        }
    ).catch( error => {
      if (error instanceof ConflictError) {
        reject("A topic already exists with this name/uri");
      } else {
        reject(error);
      }
    });
  });
  return promise;
  }

  getParticipantByEmail(email: string): Promise<Document & Participant> {
    let slug: string = this.makeFriendlySlug(email);
    return this.carbonldp.documents.$get(this.participantsRoot + slug + "/");
  }

  createParticipant(firstName:string, lastName:string, email:string, passphrase:string): Promise<Participant & Document> {
    let slug: string = this.makeFriendlySlug(email);
    let participant:Participant = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      passphrase: passphrase,
      types: [ "Participant" ]
    }
    let promise:Promise<Participant & Document> = new Promise<Participant & Document>((resolve,reject) => {
      this.carbonldp.documents.$create(this.participantsRoot, participant, slug).then(
        ( participantDocument: Participant & Document) => {
          resolve(participantDocument);
        }
      ).catch( error => {
        if (error instanceof ConflictError) {
          reject("A participant already exists with this email address");
        } else {
          reject(error);
        }
      })
    });
    return promise;
  }

  /**
     * Takes a given string and makes it URL friendly. It ignores nonalphanumeric characters,
     * replaces spaces with hyphens, and makes everything lower case.
     * @param {*} str
     */
    makeFriendlySlug(str) {
        // \W represents any nonalphanumeric character so that, for example, 'A&P Grocery' becomes 'a-p-grocery'
        let friendlySlug = str.replace(/\W+/g, '-').toLowerCase();
        // If the last char was nonalphanumeric, we could end with a hyphen, so trim that off, if so...
        if (friendlySlug.substring(friendlySlug.length - 1) === "-") {
            friendlySlug = friendlySlug.substring(0, friendlySlug.length - 1);
        }
        return friendlySlug;
    }


}
