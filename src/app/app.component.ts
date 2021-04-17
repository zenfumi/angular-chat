import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Comment } from './class/comment';
import { User } from './class/user';

const CURRENT_USER: User = new User(1, '五十川 洋平');
const ANOTHER_USER: User = new User(2, '竹井 賢治');
@Component({
  selector: 'ac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  comments$: Observable<Comment[]>;
  commentsRef: AngularFireList<Comment>;
  currentUser = CURRENT_USER;
  comment = '';

  constructor(private db: AngularFireDatabase){
    this.commentsRef =db.list('/comments');
    this.comments$ = this.commentsRef.snapshotChanges()
      .pipe(
        map((snapshots: SnapshotAction<Comment>[]) => {
          return snapshots.map(snapshot => {
            const value = snapshot.payload.val();
            return new Comment({ key: snapshot.payload.key,  ...value});
          });
        })
        )
  }
  commentDateFormat = 'yyyy年MM月dd日 HH:mm';

  addComment(comment: string): void{
    if(comment){
      this.commentsRef.push(new Comment({ user: this.currentUser, message: comment }));
      this.comment = '';
    }
  }

  updateComment(comment:  Comment):void {
    const { key, message } = comment;

    this.commentsRef.update(key, { message });
  }

  deleteComment(comment: Comment): void{
    this.commentsRef.remove(comment.key);
  }

}
