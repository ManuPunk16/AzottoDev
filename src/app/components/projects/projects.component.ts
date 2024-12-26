import { Component, OnInit } from '@angular/core';
import { Cards } from '../../models/cards.model';

@Component({
  selector: 'app-projects',
  standalone: false,

  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  public cards = Cards.cards;

  constructor() {

  }

  ngOnInit(): void {

  }

}
