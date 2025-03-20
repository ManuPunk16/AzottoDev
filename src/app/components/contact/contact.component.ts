import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ContactService } from '../../services/contact.service';
// import { Contact } from '../../models/contact.model';
// import { Timestamp } from 'firebase/firestore';
// import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-contact',
  standalone: false,

  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor (
    private fb: FormBuilder,
    // private contactService: ContactService
  ) {

  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmitt() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }
    console.log(this.contactForm.value);

    // this.firestore.collection('contacts').add(this.contactForm.value)
    //   .then(() => {
    //     this.successMessage = 'Mensaje enviado correctamente.';
    //     this.contactForm.reset(); // Limpia el formulario
    //     this.submitted = false;
    //   })
    //   .catch(error => {
    //     this.errorMessage = 'Error al enviar el mensaje: ' + error;
    //     this.submitted = false;
    //   });

    // this.contactForm.value.runInInjectionContext(() => {

    // });

    // this.contactService.createContact(this.contactForm.value).then(() => {
    //   this.submitted = true;
    //   console.log('Mensaje enviado correctamente.');
    // }).catch(error => {
    //   console.log(error);
    // });
  }

  onSubmit() {
    // this.contactService.createContact(this.contactForm.value).then(() => {
    //   this.submitted = true;
    //   console.log('Mensaje enviado correctamente.');
    // }).catch(error => {
    //   console.log(error);
    // });
  }
}
