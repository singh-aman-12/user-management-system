import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrl: './user-upsert.component.css'
})
export class UserUpsertComponent implements OnInit , OnDestroy {
  userForm!: FormGroup;
  editFlow : boolean = false;
  ActionType = "Add";
  disabledBtn : boolean = false;
  data = {} as any;
  constructor(private $service : DataService , private route : Router, private _snackBar: MatSnackBar){
  }
  
  ngOnInit(){
  this.userForm = new FormGroup({
      firstName : new FormControl('' , Validators.required),
      lastName : new FormControl('' , Validators.required),
      email : new FormControl('' , [Validators.required , Validators.email]),
      address : new FormControl('' , Validators.required),
      phone : new FormControl('' , [Validators.required , Validators.pattern("[0-9 ]{10}")])
   });
   this.resetForm();


  // to get edit user data    
 this.$service.$userSubject.subscribe((res : any) =>{
    if(res){
      this.data = res;
      this.ActionType = "Edit";
      this.userForm.patchValue({
        id : this.data?.editData?.id,
        firstName : this.data?.editData?.firstName,
        lastName : this.data?.editData?.lastName,
        email : this.data?.editData?.email,
        address : this.data?.editData?.address,
        phone : this.data?.editData?.phone
      });
      this.editFlow = true;
    }
  })
  if(!this.editFlow){
      this.getDataList();
  }
  }

  // to get user data  

  getDataList(){
    this.$service.getData().subscribe((res)=>{
      this.data.userList = res;
    })
  }
  

  dupliateCheck(arr: any , el: User){
    if(this.editFlow){
      let index = arr.findIndex((e:any) => e.email == el.email)
      arr.splice(index,1);
    }
    let duplicate = arr.filter((e: any) => e.email.trim() == el.email.trim() || e.phone == el.phone);
    if(duplicate.length){
      this._snackBar.open( "already exists" , "close" ,{
        duration: 3000
      });
    }
    return duplicate.length ? false : true;
  }

  errorMsg(){
    this._snackBar.open("Error Occured", "close" ,{
      duration: 3000
    });
  }
  
  resetForm(){
    this.userForm.reset();
  }


  // submit the data

  submitForm(){
    let obj = this.userForm.value;
   if(this.userForm.valid && this.dupliateCheck(this.data.userList , obj)){
    let api;
    let message: string;
    if(this.editFlow){
      obj.id =this.data.editData.id;
      api = this.$service.EditData(obj);
      message = "User updated Successfully";
    }
    else{
      api = this.$service.AddData(obj);
      message = "User added Successfully";
    }
    this.disabledBtn = true;
    api.subscribe(res =>{
      this.disabledBtn = false;
      if(res.status == 201 || res.status == 200){
        this.resetForm();
        this.route.navigate(['/user-list']);
        this._snackBar.open( message , "close" ,{
          duration: 3000
        });
      }
    },err=>{
      this.disabledBtn = false;
      this.errorMsg();
    })
   }
  }

  ngOnDestroy() {
    this.$service.$userSubject.next('');
  }
}

