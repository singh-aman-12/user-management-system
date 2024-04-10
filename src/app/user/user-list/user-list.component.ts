import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent  implements OnInit{
  dataList: User[]= [];
  constructor( private $service : DataService , private router : Router, private _snackBar: MatSnackBar){
  }

  ngOnInit(){
    this.getDataList();
  }


  // to get user the data 

  getDataList(){ 
    this.$service.getData().subscribe((res)=>{
      this.dataList = res;
    })
  }

 // to edit the User 

  editUser(el : User){
    let data = {
      userList : [] as any,
      editData  : {}
    }
    data.userList = this.dataList;
    data.editData = el;
   this.router.navigate(['/add-user']);
   this.$service.emitData(data);
  }

  // to delete the User

  removeUser(el:User){
   this.$service.deleteData(el).subscribe((res: any)=>{
  if(res.status == 200){
    this._snackBar.open("User Deleted Successfully", "close" ,{
      duration: 3000
    });
    this.getDataList();
  }
   },err=>{
    this._snackBar.open("Error Occured", "close" ,{
      duration: 3000
    });
   })
  }
}
