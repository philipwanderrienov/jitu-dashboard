import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-jitu-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './jitu-layout.component.html',
  styleUrl: './jitu-layout.component.css'
})
export class JituLayoutComponent {
  year = new Date().getFullYear();
}
