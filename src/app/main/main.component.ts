import { Component, OnInit } from '@angular/core';
import {MainService} from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private column = 10;
  private row = 10;
  private column2 = 36;
  private row2 = 36;


  constructor(private mainService: MainService) {
  }

  public rowArray = new Array<number>();
  public columnArray = new Array<number>();
  private rowArray2 = new Array<number>();
  private columnArray2 = new Array<number>();
  public lettersTable = new Array<Array<String>>();
  public feedbackTable = new Array<Array<String>>();
  public feedbackColumnHeader = new Array<String>();
  public feedbackRowHeader = new Array<String>();
  public lettersArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];


  ngOnInit() {
    this.mainService.fetchFirstTable().subscribe(data => {
      this.parseLettersTable(data);
    });
    for(let i = 0; i < this.column; i ++) {
      this.columnArray[i] = i;
    }

    for(let i = 0; i < this.row; i ++) {
      this.rowArray[i] = i;
    }

    for(let i = 0; i < this.column2; i ++) {
      this.columnArray2[i] = i;
    }

    for(let i = 0; i < this.row2; i ++) {
      this.rowArray2[i] = i;
    }
  }

  private parseLettersTable(lettersTable: String) {
    const lines: Array<String> = lettersTable.split('\n');
    lines.forEach(line => {
      const values: Array<String> = line.split(' ');
      if (values.length > 1) {
        this.lettersTable.push(values);
      }
    });
  }

  public showNext(row, column) {
    this.resetFeedbackValues();
    const rowLetter = String.fromCharCode(65 + row);
    const columnLetter = String.fromCharCode(65 + column);

    this.mainService.fetchHeader('Letter_' + rowLetter + '.txt').subscribe(rowData => {
      this.feedbackRowHeader = rowData.split('\n');
      this.feedbackRowHeader = this.feedbackRowHeader.map(value => value.substring(0, 3) + '\n' + value.substr(3, 6));
      this.mainService.fetchHeader('Letter_' + columnLetter + '.txt').subscribe(columnData => {
        this.feedbackColumnHeader = columnData.split('\n');
        this.feedbackColumnHeader = this.feedbackColumnHeader.map(value => value.substring(0, 3) + '\n' + value.substr(3, 6));
        const feedbackFileName = rowLetter + columnLetter + '.txt';
        this.mainService.fetchFeedback(feedbackFileName).subscribe(feedbackData => {
          this.parseFeedback(feedbackData);
        });
      });
    });
  }


  private parseFeedback(feedback: String) {
    const lines: Array<String> = feedback.split('\n');
    lines.forEach(line => {
      let values: Array<String> = line.split(' ');
      if (values.length > 1) {
        values = values.map(value => {
          if (value !== '-') {
            return value.substring(0, 3) + '\n' + value.substr(3, 6);
          }
          return value;
        });
        this.feedbackTable.push(values);
      }
    });
  }

  private resetFeedbackValues() {
    this.feedbackTable = new Array<Array<String>>();
    this.feedbackColumnHeader = new Array<String>();
    this.feedbackRowHeader = new Array<String>();
  }
}
