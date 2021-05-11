import { ChangeDetectorRef, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  host:{"(window:paste)": "onPaste( $event )"}
})
export class NotesComponent implements OnInit{

  imageUrls:SafeUrl[];
  savedText='';
  private sanitizer: DomSanitizer;

  constructor(sanitizer: DomSanitizer, private changeDetector:ChangeDetectorRef) {
    this.sanitizer = sanitizer;
    this.imageUrls=[];
  }
  ngOnInit(): void {
    this.imageUrls=JSON.parse(localStorage.getItem('imageUrls')||'');
    this.savedText=localStorage.getItem('savedText')||'';
  }


  onPaste(event: ClipboardEvent ) {
    var pastedImage = this.getPastedImage( event );
		if ( ! pastedImage ) {
			return;
		}
    this.imageUrls.unshift(this.sanitizer.bypassSecurityTrustUrl( URL.createObjectURL( pastedImage )));
    const imageurlString = JSON.stringify(this.imageUrls)
    localStorage.setItem('imageUrls',imageurlString);
    this.changeDetector.detectChanges();
  }

  deleteImage(index:number){
    this.imageUrls.splice(index,1);
    const imageurlString = JSON.stringify(this.imageUrls)
    localStorage.setItem('imageUrls',imageurlString);
    this.changeDetector.detectChanges();
  }

  saveText(text:string){
    this.savedText=text;
    localStorage.setItem('savedText',this.savedText);
  }

  private getPastedImage( event: ClipboardEvent ) : File | null {
		if (
			event.clipboardData && 
			event.clipboardData.files && 
			event.clipboardData.files.length &&
			this.isImageFile( event.clipboardData.files[ 0 ] )
			) {
			return( event.clipboardData.files[ 0 ] );
		}
		return( null );
	}

  private isImageFile( file: File ) : boolean {
		return( file.type.search( /^image\//i ) === 0 );
	}
    
}
