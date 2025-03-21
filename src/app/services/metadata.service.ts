import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  constructor(private meta: Meta) {}

  updateMetadata(metadata: any) {
    this.meta.updateTag({ name: 'description', content: metadata.description || '' });
    this.meta.updateTag({ name: 'keywords', content: metadata.keywords || '' });
    this.meta.updateTag({ name: 'title', content: metadata.title || 'Nombre de tu sitio' });
  }
}
