import { Injectable } from '@angular/core';
import { Topic } from './topic';
import { Idea } from './idea';
import { Participant } from './participant'
import { CarbonLDP } from 'carbonldp/CarbonLDP';
import { Document } from 'carbonldp/Document';
import { AccessPoint, TransientAccessPoint } from 'carbonldp/AccessPoint';
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
       "description": {
         "@type":"string"
       },
       "likedBy": {
         "@type":"@id",
         "@container":"@set"
       },
       "dislikedBy": {
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
    for (let idx in topic.accessPoints) {
      this.carbonldp.documents.$get(topic.accessPoints[idx].$id).then( (thisPoint: AccessPoint & Document) => {
        thisPoint.$delete();
      });
    }
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
    return this.carbonldp.documents.$getChildren<Idea>( this.topicsRoot + this.selectedTopic.$slug + "/",
    _ => _
     .withType( "Idea" )
     .properties( {
       "description": _.inherit,
       "likedBy": _.inherit,
       "dislikedBy": _.inherit
     })
   );
  }

  topicAdded$ = this.topicAddedSource.asObservable();

  topicCreated(topic: Topic & Document) {
    this.topicAddedSource.next(topic);
  }

  createTopic(topicName: string, owner: any, participants?: any[]): Promise<any> {

    const topic: Topic = {
      name: topicName,
      types: [ "Topic" ]
    };

    let createdTopic;

    let promise: Promise<void | Topic & Document> =
      this.carbonldp.documents.$create(this.topicsRoot, topic, this.makeFriendlySlug(topicName) )
      .then((newTopic: Topic & Document) => {
        createdTopic = newTopic;
      }).then( () => {
        let topicOwnerAccessPoint = AccessPoint.create( {
          hasMemberRelation: "owner",
          isMemberOfRelation: "topicOwner"
        });

       return createdTopic.$create( topicOwnerAccessPoint, "owner").then(
          (persistedOwnerAccessPoint: TransientAccessPoint & Document) => {
            return persistedOwnerAccessPoint.$addMembers( [owner] );
          }
        );
      }).then( () => {
        let topicParticipantsAccessPoint = AccessPoint.create( {
          hasMemberRelation: "participants",
          isMemberOfRelation: "topicParticipant"
        } );

        return createdTopic.$create( topicParticipantsAccessPoint, "participants" ).then(
          (persistedParticipantsAccessPoint: TransientAccessPoint & Document) => {
            if (participants.length > 0) {
              return persistedParticipantsAccessPoint.$addMembers( participants );
            } else {
              return;
            }
          }
        );
      }).then(() => {
        return Promise.resolve(createdTopic);
      })
      .catch( error => {
        if (error instanceof ConflictError) {
          return Promise.reject("A topic already exists with this name/uri");
        } else {
          return Promise.reject(error);
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
          return Promise.reject("A participant already exists with this email address");
        } else {
          return Promise.reject(error);
        }
      });

    return promise;
  }

  addTopicParticipant(participant: any) {
    return this.carbonldp.documents.$get(this.selectedTopic.$id + 'participants/').then( (point: AccessPoint & Document) => {
        return point.$addMember(participant);
    }).then(
        _ => {
            return this.selectedTopic.$refresh();
        }
    );
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

    let savedIdea;

    return this.carbonldp.documents.$create(this.topicsRoot + topicSlug + '/', idea )
    .then((newIdea: Idea & Document) => {
      savedIdea = newIdea;
    }).then(() => {
      let likesAccessPoint = AccessPoint.create( {
        hasMemberRelation: "likedBy",
        isMemberOfRelation: "likesIdeas"
      });

      return savedIdea.$create( likesAccessPoint, "likes").then(
        (persistedLikesPoint: TransientAccessPoint & Document) => {
          return; // persistedLikesPoint.$addMembers( //NONE YET// );
        }
      );
    }).then(() => {
      let dislikesAccessPoint = AccessPoint.create( {
        hasMemberRelation: "dislikedBy",
        isMemberOfRelation: "dislikesIdeas"
      });

      return savedIdea.$create( dislikesAccessPoint, "dislikes").then(
        (persistedDislikesPoint: TransientAccessPoint & Document) => {
          return; // persistedLikesPoint.$addMembers( //NONE YET// );
        }
      );
    }).then(() => {
      this.ideaCreated(savedIdea);
    });
  }

  toggleIdeaLikedBy(idea: any, participant: any): any {
    let firstLike: boolean = Object.keys(idea).indexOf('likedBy') == -1;
    let hasLike: boolean = false;
    if (!firstLike){
      hasLike = idea.likedBy.indexOf(participant) > -1;
    }

    return this.carbonldp.documents.$get(idea.$id + 'likes/').then( (point: AccessPoint & Document) => {
      if (hasLike) {
        return point.$removeMember(participant);
      } else {
        return point.$addMember(participant);
      }
    }).then( _ => {
      return idea.$refresh();
    });
  }

  toggleIdeaDislikedBy(idea: any, participant: any): any {
    let firstDislike: boolean = Object.keys(idea).indexOf('dislikedBy') == -1;
    let hasDislike: boolean = false;
    if (!firstDislike){
      hasDislike = idea.dislikedBy.indexOf(participant) > -1;
    }

    return this.carbonldp.documents.$get(idea.$id + 'dislikes/').then( (point: AccessPoint & Document) => {
      if (hasDislike) {
        return point.$removeMember(participant);
      } else {
        return point.$addMember(participant);
      }
    }).then( _ => {
      return idea.$refresh();
    });
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
