import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-format-json',
  templateUrl: './format-json.component.html',
  styleUrls: ['./format-json.component.scss']
})
export class FormatJsonComponent implements OnInit {
  title = 'notes';
  convertedText = '';
  prettyJson = '';
  constructor() { }
  
  ngOnInit(): void {
  }
  formatJson(inputText:string){
    try {
      this.convertedText = JSON.parse(inputText);
      const jsonString: any = JSON.stringify(this.convertedText, null, 3);
      this.prettyJson = jsonString.replaceAll('\n', '\n \n');
    } catch (error) {
      this.prettyJson = error.toString();
    }
  }

}
