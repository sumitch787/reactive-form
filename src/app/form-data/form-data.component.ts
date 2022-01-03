import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup ,Validators} from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CountdownConfig, CountdownEvent} from 'ngx-countdown';

@Component({
  selector: 'app-form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.css']
})

export class FormDataComponent implements OnInit {
config: CountdownConfig ={};

url = "something"  //Update with Working URL

formdata!: FormGroup;
hidebutton: boolean = true;
successAlert: boolean = false;
disableLink: boolean = false;
showVerify: boolean =  false;
maxRetry: boolean = false;
apiError: boolean = false;
countDown: boolean = false;
count = 0;
new_mobile_number = "";
otp = new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.pattern('[0-9]{4}')])

constructor(private http:HttpClient) {}
// For Appending 9 in number
mobile_number_converter(form: FormGroup){
  this.new_mobile_number =  '9'+String(this.formdata.get('mobile')?.value)
  return Number(this.new_mobile_number);
}

getOTP(form: FormGroup){
  if(this.count < 3){
    if(this.formdata.valid){
      this.postAPI();
    }
  }
  else{
    this.maxRetry = true;
    this.hidebutton = !this.hidebutton;
  }
}

VerifyOTP(){
  if (this.count<3) {
    if (this.otp.valid){
      this.mobile_number_converter(this.formdata.value);
      this.verifyAPI()
    }
}}
// GetOTP
postAPI(){
this.http.post(this.url,{
  "fullname":"this.formdata.get('fullname').value",
  "email":"this.formdata.get('email').value",
  "city":"this.formdata.get('city').value",
  "panNumber":"this.formdata.get('panNumber').value",
  "mobile":"this.formdata.get('mobile').value"
}).pipe(catchError(
  err => {
    this.apiError = true;
    this.count++;
    this.startCounter();
    return throwError(()=>err);
  }
)).subscribe(()=>{
  this.count++; 
  this.startCounter();
})}

//Verify OTP 
verifyAPI(){
  this.http.post(this.url,{
    "otp": "this.opt.value",
    "mobile": "this.new_mobile_number"
  }).pipe(
    catchError(
      err => {
        console.log("Something Bad Happened",err);
        this.apiError = true;
        return throwError(()=>err);
      }
    )
  ).subscribe(
    ()=> {
      this.success();
    }
  );
  }

reset(){
this.formdata.reset();
this.otp.reset();
this.successAlert = !this.successAlert;
this.countDown = !this.countDown;
this.showVerify =!this.showVerify;
}

reset_max(){
  this.maxRetry = !this.maxRetry;
  this.showVerify = true;
  this.formdata.reset();
  this.otp.reset()
}
close(){
  this.apiError = false;
}

startCounter(){
   this.hidebutton = !this.hidebutton;
   this.disableLink  = !this.disableLink;
   this.countDown = !this.countDown;   
   this.config = {leftTime: 180, format: 'mm:ss'};


}
handleEvent(ev: CountdownEvent){
  if(ev.left === 0){
  this.hidebutton = !this.hidebutton;
  this.countDown = !this.countDown;
  this.disableLink = !this.disableLink;
  }
}

success(){
  this.successAlert = !this.successAlert;
  this.showVerify = !this.showVerify;
  this.countDown = !this.countDown;
  this.hidebutton = !this.hidebutton;
}


private createForm(){
  this.formdata = new FormGroup({
    fullname: new FormControl('',[Validators.required,Validators.maxLength(140)]),
    email: new FormControl('',[Validators.required,Validators.email,Validators.pattern('[a-zA-Z0-9]*@[a-zA-Z0-9]*.[a-zA-Z0-9]{2,4}')]),
    city: new FormControl('',[Validators.required,Validators.pattern('[a-zA-Z]*')]),
    panNumber: new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('[a-zA-Z0-9]{10}')]),
    mobile: new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('[0-9]{10}')]),
   });
 }

 ngOnInit(): void {
    this.createForm();
  }

}
