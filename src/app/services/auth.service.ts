import { Injectable } from '@angular/core';
import { Participant } from './participant';
import { TopicService } from './topic.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn = false;
  userParticipant: Participant = null;

  redirectUrl: string;

  constructor(private topicService: TopicService) {}

  login(email:string, passphrase: string):Promise<any> {
    this.isLoggedIn = false; //
    let slug:string = this.topicService.makeFriendlySlug(email);
    let promise = new Promise((resolve, reject) => {
      this.topicService.getParticipantByEmail(slug).then(
        (participant: Participant) => {
          if (participant.passphrase === passphrase) {
            console.log('Participant', participant);
            this.userParticipant = participant;
            this.isLoggedIn = true;
            resolve();
          } else {
            reject("Invalid passphrase.");
          }
        }
      ).catch( error => reject(error));
    });
    return promise;
  }

  logout() {
    this.isLoggedIn = false;
    this.userParticipant = null;
  }

  createAccount(firstName: string, lastName: string, email: string, passphrase: string):Promise<any> {
    this.isLoggedIn = false;

    let promise = new Promise<any>((resolve, reject) => {
      this.topicService.createParticipant(firstName, lastName, email, passphrase).then(
        ( participant:Participant ) => {
          this.isLoggedIn = true;
          this.userParticipant = participant;
          resolve();
        }
      ).catch( error => {
        reject(error);
      });
    });
    return promise;
  }

}
