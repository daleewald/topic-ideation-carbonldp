import { Injectable } from '@angular/core';
import { CarbonLDP } from "carbonldp/CarbonLDP";
import { Document } from "carbonldp/Document";

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  carbonldp:CarbonLDP;

  constructor() {
  }

  createInstance() {
//
  }

  createTopic() {
    // initialize your CarbonLDP object with the domain where your platform lives
    //this.carbonldp = new CarbonLDP( "http://carbon2.local.com:8083" );

    interface Topic {
        name: string,
        [propName: string]: any
    }

    let topic:Topic = {
      name: "TopicA",
      participants: [
        "Dale Ewald",
        "Michele Ewald"
      ],
      ideas: [
        {
          description: "Create a topic-based ideation utility"
        },
        {
          description: "Enable multiple participants"
        }
      ]
    };

    this.carbonldp.documents.$create("/", topic ).then(
        ( topicDocument: Topic & Document ) => {
          console.log(topic === topicDocument);
          console.log(topic.$id);
        }
    ).catch( error => console.error(error));
  }
}
