import { Injectable, signal, effect, computed } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'capacity-dashboard-theme';

  readonly mode = signal<ThemeMode>(this.loadSavedTheme());

  readonly isDark = computed(() => {
    const mode = this.mode();
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return mode === 'dark';
  });

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark', dark);
      document.body.style.colorScheme = dark ? 'dark' : 'light';
      localStorage.setItem(ThemeService.STORAGE_KEY, this.mode());
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.mode() === 'system') {
        // Force re-evaluation by setting the same value
        this.mode.set('system');
      }
    });
  }

  toggle(): void {
    const current = this.mode();
    if (current === 'light') {
      this.mode.set('dark');
    } else if (current === 'dark') {
      this.mode.set('light');
    } else {
      // system -> toggle based on current resolved value
      this.mode.set(this.isDark() ? 'light' : 'dark');
    }
  }

  private loadSavedTheme(): ThemeMode {
    const saved = localStorage.getItem(ThemeService.STORAGE_KEY) as ThemeMode | null;
    return saved ?? 'light';
  }
}
