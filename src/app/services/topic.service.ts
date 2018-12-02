import { Injectable } from '@angular/core';
import { CarbonLDP } from 'carbonldp/CarbonLDP';
import { Document } from 'carbonldp/Document';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  carbonldp: CarbonLDP;

  constructor() {
    // initialize your CarbonLDP object with the domain where your platform lives
    this.carbonldp = new CarbonLDP( 'http://carbon2.local.com:8083' );
  }

  createTopic(topicName: string) {
    interface Topic {
        name: string;
        [propName: string]: any;
    }

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

    this.carbonldp.documents.$create('topics/', topic, this.makeFriendlySlug(topicName) ).then(
        ( topicDocument: Topic & Document ) => {
          resolve(topic.$id);
        }
    ).catch( error => {
      reject(error);
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
