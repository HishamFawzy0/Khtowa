import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-tutors',
  imports: [FormsModule, CommonModule],
  templateUrl: './tutors.html',
  styleUrl: './tutors.css',
})
export class Tutors {
  tutors: any[] = [
    {
      name: 'Creative Studio',
      title: 'Senior UI/UX Designer',
      location: 'Germany',
      isOnline: true,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    }, 
    {
      name: 'CodeLab',
      title: 'Full Stack  Developer',
      location: 'USA',
      isOnline: false,
      rating: 4,
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Design Nest',
      title: 'Graphic Design Specialist',
      location: 'Italy',
      isOnline: true,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'TechHive',
      title: 'Flutter Mobile Developer',
      location: 'India',
      isOnline: false,
      rating: 3,
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'PixelPlay',
      title: 'Motion Graphics Expert',
      location: 'Spain',
      isOnline: true,
      rating: 4,
      image:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Bright Minds',
      title: 'Python Backend Engineer',
      location: 'Netherlands',
      isOnline: false,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Idea Forge',
      title: 'Data Science Consultant',
      location: 'Canada',
      isOnline: true,
      rating: 4,
      image:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'DevX Labs',
      title: 'Senior Software Architect',
      location: 'UK',
      isOnline: false,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'VisionWorks',
      title: 'React Frontend Developer',
      location: 'France',
      isOnline: true,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Algo Craft',
      title: 'AI/ML Engineer',
      location: 'Sweden',
      isOnline: false,
      rating: 4,
      image:
        'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Nexa Studio',
      title: 'DevOps Specialist',
      location: 'Denmark',
      isOnline: true,
      rating: 4,
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'UI Forge',
      title: 'Digital Product Designer',
      location: 'Poland',
      isOnline: false,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'CloudRoot',
      title: 'AWS Cloud Architect',
      location: 'Finland',
      isOnline: true,
      rating: 3,
      image:
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'CyberShift',
      title: 'Cybersecurity Analyst',
      location: 'Norway',
      isOnline: false,
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'AppWave',
      title: 'Senior iOS Developer',
      location: 'Ireland',
      isOnline: true,
      rating: 4,
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'CodeCraft',
      title: 'Kotlin Android Developer',
      location: 'Brazil',
      isOnline: false,
      rating: 3,
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    },
  ];
  searchTerm: string = '';

  fillterTutors: any[] = this.tutors;

  filteredTutors() {
    this.fillterTutors = this.tutors.filter((tutor) => {
      return tutor.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }
}
