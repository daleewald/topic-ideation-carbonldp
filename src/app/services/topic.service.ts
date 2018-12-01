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

  createTopic() {

    console.log('>> TopicService.createTopic()');

    interface Topic {
        name: string;
        [propName: string]: any;
    }

    const topic: Topic = {
      name: 'TopicA',
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

    this.carbonldp.documents.$create('topics/', topic ).then(
        ( topicDocument: Topic & Document ) => {
          console.log(topic === topicDocument);
          console.log(topic.$id);
        }
    ).catch( error => console.error(error));
  }
}
