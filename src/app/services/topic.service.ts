import { Injectable } from '@angular/core';
import { Topic } from './topic';
import { Idea } from './idea';
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
  private topicSelectedSource = new Subject<Topic & Document>();
  private ideaAddedSource = new Subject<Idea & Document>();

  selectedTopic: Topic & Document = null;

  constructor() {
    this.carbonUri = environment.carbonldp.protocol + '://' + environment.carbonldp.host;
    // initialize your CarbonLDP object with the domain where your platform lives
    this.carbonldp = new CarbonLDP( this.carbonUri );


    this.carbonldp.extendObjectSchema( "Topic", {
        "owner": {
          "@type":"@id"
        },
        "participants": {
          "@type":"@id",
          "@container":"@set"
        }
    });
    this.carbonldp.extendObjectSchema( "Idea", {
       "likes": {
         "@type":"@id",
         "@container":"@set"
       },
       "dislikes": {
         "@type":"@id",
         "@container":"@set"
       }
    });

  }

  getTopic(slug: string): Promise<Document & Topic> {
    let topicId:string = this.topicsRoot + slug + '/';
    let promise: Promise<Document & Topic> = this.carbonldp.documents.$get<Topic>( topicId, _ => _
      .withType( "Topic" )
      .properties( {
        "name": _.inherit,
        "owner": {
          "query": _ => _
            .properties( {
              "firstName": _.inherit,
              "lastName": _.inherit,
              "email": _.inherit
            } )
        },
        "participants": {
          "query": _ => _
            .properties( {
              "firstName": _.inherit,
              "lastName": _.inherit,
              "email": _.inherit
            } )
        }
      })
    );
    return promise;
  }

  topicSelected$ = this.topicSelectedSource.asObservable();

  topicSelected(topic: Topic & Document) {
    this.selectedTopic = topic;
    this.topicSelectedSource.next(topic);
  }

  deleteTopic(topic: Document & Topic): Promise<any> {
    return topic.$delete();
  }

  listTopicDocuments() {
    let promise = this.carbonldp.documents.$getChildren<Topic>( this.topicsRoot );
    return promise;
  }

  listTopics() {
    let promise = this.carbonldp.documents.$listChildren<Topic>( this.topicsRoot );
    return promise;
  }

  listSelectedTopicIdeas():Promise<any> {
    if (this.selectedTopic == null) return Promise.resolve([]);
    return this.carbonldp.documents.$getChildren<Idea>( this.topicsRoot + this.selectedTopic.$slug + "/");
  }

  topicAdded$ = this.topicAddedSource.asObservable();

  topicCreated(topic: Topic & Document) {
    this.topicAddedSource.next(topic);
  }

  createTopic(topicName: string, owner: any, participants?: any[]): Promise<any> {

    const topic: Topic = {
      name: topicName,
      owner: owner,
      participants: participants,
      types: [ "Topic" ]
    };

    let promise: Promise<void | Topic & Document> =
      this.carbonldp.documents.$create(this.topicsRoot, topic, this.makeFriendlySlug(topicName) )
      .catch( error => {
        if (error instanceof ConflictError) {
          Promise.reject("A topic already exists with this name/uri");
        } else {
          Promise.reject(error);
        }
      });
    return promise;
  }

  getParticipantByEmail(email: string): Promise<Document & Participant> {
    let slug: string = this.makeFriendlySlug(email);
    return this.carbonldp.documents.$get(this.participantsRoot + slug + "/");
  }

  createParticipant(firstName:string, lastName:string, email:string, passphrase:string): Promise<any> {
    let slug: string = this.makeFriendlySlug(email);
    let participant:Participant = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      passphrase: passphrase
    }
    let promise:Promise<void | Participant & Document> =
      this.carbonldp.documents.$create(this.participantsRoot, participant, slug)
      .catch( error => {
        if (error instanceof ConflictError) {
          Promise.reject("A participant already exists with this email address");
        } else {
          Promise.reject(error);
        }
      });

    return promise;
  }

  ideaAdded$ = this.ideaAddedSource.asObservable();

  ideaCreated(idea: Idea & Document) {
    this.ideaAddedSource.next(idea);
  }

  createTopicIdea(topicSlug: string, description: string): Promise<any> {

    const idea: Idea = {
      description: description,
      types: [ "Idea" ]
    };

    return this.carbonldp.documents.$create(this.topicsRoot + topicSlug + '/', idea )
    .then((savedIdea: Idea & Document) => { this.ideaCreated(savedIdea) });
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
