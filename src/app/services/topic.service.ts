import { Injectable } from '@angular/core';
import { Topic } from './Topic';
import { CarbonLDP } from 'carbonldp/CarbonLDP';
import { Document } from 'carbonldp/Document';
import { ConflictError } from 'carbonldp/HTTP/Errors';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  carbonldp: CarbonLDP;
  carbonUri: string = 'http://carbon2.local.com:8083';
  topicsRoot: string = "topics/";
  private topicAddedSource = new Subject<Topic & Document>();

  constructor() {
    // initialize your CarbonLDP object with the domain where your platform lives
    this.carbonldp = new CarbonLDP( this.carbonUri );
  }

  listTopicDocuments() {
    let promise = new Promise((resolve, reject) => {
      this.carbonldp.documents.$getChildren<Topic>( this.topicsRoot ).then(
        ( topics:( Topic & Document )[] ) => {
          resolve(topics); // array of shallow documents
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

  createTopic(topicName: string) {

    const topic: Topic = {
      name: topicName,
      participants: [
        'Cholla Saguaro',
        'Prickly Pear'
      ],
      ideas: [
        {
          description: 'Create a topic-based ideation utility'
        },
        {
          description: 'Enable multiple participants'
        }
      ]
    };

    let promise = new Promise((resolve, reject) => {

    this.carbonldp.documents.$create(this.topicsRoot, topic, this.makeFriendlySlug(topicName) ).then(
        ( topicDocument: Topic & Document ) => {
          this.topicCreated(topicDocument);
          resolve(topic.$id);
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
