import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private $http : HttpClient) { }
   
  $userSubject = new BehaviorSubject<any>('');

  emitData(data :any){
    this.$userSubject.next(data);
  }

  getData() : Observable<User[]> {
     return this.$http.get<User[]>('http://localhost:3000/userList').pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  AddData(data : User) {
    return this.$http.post('http://localhost:3000/userList' , data ,  {
      observe: 'response',
    }).pipe(
     map((response: any) => {
       return response; 
     })
   );
 }
 EditData(data : User) {
  return this.$http.put('http://localhost:3000/userList/' + `${data.id}` , data ,  {
    observe: 'response',
  }).pipe(
   map((response: any) => {
     return response; 
   })
 );
}
deleteData(data : User) {
  return this.$http.delete('http://localhost:3000/userList/' + `${data.id}` ,   {
    observe: 'response',
  }).pipe(
   map((response: any) => {
     return response; 
   })
 );
}
}
