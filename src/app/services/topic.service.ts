import { Injectable } from '@angular/core';
import { Topic } from './topic';
import { Idea } from './idea';
import { Participant } from './participant';
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

  topicsRoot = 'topics/';
  participantsRoot = 'participants/';

  private topicAddedSource = new Subject<Topic & Document>();
  topicAdded$ = this.topicAddedSource.asObservable();

  private topicSelectedSource = new Subject<Topic & Document>();
  topicSelected$ = this.topicSelectedSource.asObservable();

  private ideaAddedSource = new Subject<Idea & Document>();
  ideaAdded$ = this.ideaAddedSource.asObservable();

  selectedTopic: Topic & Document = null;

  constructor() {
    this.carbonUri = environment.carbonldp.protocol + '://' + environment.carbonldp.host;
    // initialize your CarbonLDP object with the domain where your platform lives
    this.carbonldp = new CarbonLDP( this.carbonUri );


    this.carbonldp.extendObjectSchema( 'Topic', {
        'owner': {
          '@type': '@id'
        },
        'participants': {
          '@type': '@id',
          '@container': '@set'
        }
    });
    this.carbonldp.extendObjectSchema( 'Idea', {
       'description': {
         '@type': 'string'
       },
       'likedBy': {
         '@type': '@id',
         '@container': '@set'
       },
       'dislikedBy': {
         '@type': '@id',
         '@container': '@set'
       }
    });

  }

  getTopic(slug: string): Promise<Document & Topic> {
    const topicId = this.topicsRoot + slug + '/';
    const promise: Promise<Document & Topic> = this.carbonldp.documents.$get<Topic>( topicId, _ => _
      .withType( 'Topic' )
      .properties( {
        'name': _.inherit,
        'owner': {
          'query': _ => _
            .properties( {
              'firstName': _.inherit,
              'lastName': _.inherit,
              'email': _.inherit
            } )
        },
        'participants': {
          'query': _ => _
            .properties( {
              'firstName': _.inherit,
              'lastName': _.inherit,
              'email': _.inherit
            } )
        }
      })
    );
    return promise;
  }

  topicSelected(topic: Topic & Document) {
    this.selectedTopic = topic;
    this.topicSelectedSource.next(topic);
  }

  deleteTopic(topic: Document & Topic): Promise<any> {
    // tslint:disable-next-line:prefer-const
    for (let idx in topic.accessPoints) {
        if (topic.accessPoints.hasOwnProperty(idx)) {
          this.carbonldp.documents.$get(topic.accessPoints[idx].$id).then( (thisPoint: AccessPoint & Document) => {
            thisPoint.$delete();
          });
      }
    }
    return topic.$delete();
  }

  listTopicDocuments() {
    const promise = this.carbonldp.documents.$getChildren<Topic>( this.topicsRoot );
    return promise;
  }

  listTopics() {
    const promise = this.carbonldp.documents.$listChildren<Topic>( this.topicsRoot );
    return promise;
  }

  listSelectedTopicIdeas(): Promise<any> {
    if (this.selectedTopic == null) { return Promise.resolve([]); }
    return this.carbonldp.documents.$getChildren<Idea>( this.topicsRoot + this.selectedTopic.$slug + '/',
    _ => _
     .withType( 'Idea' )
     .properties( {
       'description': _.inherit,
       'likedBy': _.inherit,
       'dislikedBy': _.inherit
     })
   );
  }

  topicCreated(topic: Topic & Document) {
    this.topicAddedSource.next(topic);
  }

  createTopic(topicName: string, owner: any, participants?: any[]): Promise<any> {

    const topic: Topic = {
      name: topicName,
      types: [ 'Topic' ]
    };

    let createdTopic: Topic & Document;

    const promise: Promise<void | Topic & Document> =
      this.carbonldp.documents.$create(this.topicsRoot, topic, this.makeFriendlySlug(topicName) )
      .then((newTopic: Topic & Document) => {
        createdTopic = newTopic;
      }).then( () => {
        const topicOwnerAccessPoint = AccessPoint.create( {
          hasMemberRelation: 'owner',
          isMemberOfRelation: 'topicOwner'
        });

       return createdTopic.$create( topicOwnerAccessPoint, 'owner').then(
          (persistedOwnerAccessPoint: TransientAccessPoint & Document) => {
            return persistedOwnerAccessPoint.$addMembers( [owner] );
          }
        );
      }).then( () => {
        const topicParticipantsAccessPoint = AccessPoint.create( {
          hasMemberRelation: 'participants',
          isMemberOfRelation: 'topicParticipant'
        } );

        return createdTopic.$create( topicParticipantsAccessPoint, 'participants' ).then(
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
          return Promise.reject('A topic already exists with this name/uri');
        } else {
          return Promise.reject(error);
        }
      });
    return promise;
  }

  getParticipantByEmail(email: string): Promise<Document & Participant> {
    const slug: string = this.makeFriendlySlug(email);
    return this.carbonldp.documents.$get(this.participantsRoot + slug + '/');
  }

  createParticipant(firstName: string, lastName: string, email: string, passphrase: string): Promise<any> {
    const slug: string = this.makeFriendlySlug(email);
    const participant: Participant = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      passphrase: passphrase
    };
    const promise: Promise<void | Participant & Document> =
      this.carbonldp.documents.$create(this.participantsRoot, participant, slug)
      .catch( error => {
        if (error instanceof ConflictError) {
          return Promise.reject('A participant already exists with this email address');
        } else {
          return Promise.reject(error);
        }
      });

    return promise;
  }

  async addTopicParticipant(participant: any) {
    return this.carbonldp.documents.$get(this.selectedTopic.$id + 'participants/').then( (point: AccessPoint & Document) => {
        return point.$addMember(participant);
    }).then(
        _ => {
            return this.selectedTopic.$refresh();
        }
    );
  }

  ideaCreated(idea: Idea & Document) {
    this.ideaAddedSource.next(idea);
  }

  async createTopicIdea(topicSlug: string, description: string): Promise<any> {

    const idea: Idea = {
      description: description,
      types: [ 'Idea' ]
    };

    let savedIdea: Idea & Document;

    return this.carbonldp.documents.$create(this.topicsRoot + topicSlug + '/', idea )
    .then((newIdea: Idea & Document) => {
      savedIdea = newIdea;
    }).then(() => {
      const likesAccessPoint = AccessPoint.create( {
        hasMemberRelation: 'likedBy',
        isMemberOfRelation: 'likesIdeas'
      });

      return savedIdea.$create( likesAccessPoint, 'likes').then(
        (persistedLikesPoint: TransientAccessPoint & Document) => {
          return; // persistedLikesPoint.$addMembers( //NONE YET// );
        }
      );
    }).then(() => {
      const dislikesAccessPoint = AccessPoint.create( {
        hasMemberRelation: 'dislikedBy',
        isMemberOfRelation: 'dislikesIdeas'
      });

      return savedIdea.$create( dislikesAccessPoint, 'dislikes').then(
        (persistedDislikesPoint: TransientAccessPoint & Document) => {
          return; // persistedLikesPoint.$addMembers( //NONE YET// );
        }
      );
    }).then(() => {
      this.ideaCreated(savedIdea);
    });
  }

  toggleIdeaLikedBy(idea: any, participant: any): any {
    const hasLike: boolean = idea.likedBy
        && idea.likedBy.indexOf(participant) !== -1;

    if (hasLike) {
      idea.$removeMember('likes/', participant).then(_ => {
        return idea.$refresh();
      });
    } else {
      idea.$removeMember('dislikes/', participant).then(_ => {
          return idea.$addMember('likes/', participant).then( (member: any) => {
              return idea.$refresh();
          });
      });
    }
  }

  toggleIdeaDislikedBy(idea: any, participant: any): any {
    const hasDislike: boolean = idea.dislikedBy
        && idea.dislikedBy.indexOf(participant) !== -1;

    if (hasDislike) {
      idea.$removeMember('dislikes/', participant).then(_ => {
        return idea.$refresh();
      });
    } else {
      idea.$removeMember('likes/', participant).then(_ => {
        return idea.$addMember('dislikes/', participant).then( (member: any) => {
          return idea.$refresh();
        });
      });
    }
  }

  /**
     * Takes a given string and makes it URL friendly. It ignores nonalphanumeric characters,
     * replaces spaces with hyphens, and makes everything lower case.
     * @param str The string to test
     */
    makeFriendlySlug(str) {
        // \W represents any nonalphanumeric character so that, for example, 'A&P Grocery' becomes 'a-p-grocery'
        let friendlySlug = str.replace(/\W+/g, '-').toLowerCase();
        // If the last char was nonalphanumeric, we could end with a hyphen, so trim that off, if so...
        if (friendlySlug.substring(friendlySlug.length - 1) === '-') {
            friendlySlug = friendlySlug.substring(0, friendlySlug.length - 1);
        }
        return friendlySlug;
    }


}
