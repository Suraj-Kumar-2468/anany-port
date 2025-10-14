import portfolioData from './data/portfolioData.json';

describe('Portfolio Data Structure Tests', () => {
  test('portfolio data is valid JSON', () => {
    expect(portfolioData).toBeDefined();
    expect(typeof portfolioData).toBe('object');
  });

  test('profile data exists and is valid', () => {
    expect(portfolioData.profile).toBeDefined();
    expect(portfolioData.profile.name).toBe('Alex Thompson');
    expect(portfolioData.profile.title).toBe('Video Editor & Creative Storyteller');
    expect(portfolioData.profile.bio).toBeDefined();
  });

  test('videos data structure is correct', () => {
    expect(portfolioData.videos).toBeDefined();
    expect(portfolioData.videos.fullLength).toBeDefined();
    expect(portfolioData.videos.shorts).toBeDefined();
    expect(Array.isArray(portfolioData.videos.fullLength)).toBe(true);
    expect(Array.isArray(portfolioData.videos.shorts)).toBe(true);
  });

  test('videos have required properties', () => {
    portfolioData.videos.fullLength.forEach(video => {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
      expect(video.url).toBeDefined();
    });

    portfolioData.videos.shorts.forEach(video => {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
      expect(video.url).toBeDefined();
    });
  });

  test('work projects data is valid', () => {
    expect(portfolioData.sections.work.projects).toBeDefined();
    expect(Array.isArray(portfolioData.sections.work.projects)).toBe(true);
    expect(portfolioData.sections.work.projects.length).toBeGreaterThan(0);
  });

  test('projects have required properties', () => {
    portfolioData.sections.work.projects.forEach(project => {
      expect(project.id).toBeDefined();
      expect(project.name).toBeDefined();
      expect(project.link).toBeDefined();
    });
  });

  test('about section data is valid', () => {
    expect(portfolioData.sections.about).toBeDefined();
    expect(portfolioData.sections.about.content.skills).toBeDefined();
    expect(Array.isArray(portfolioData.sections.about.content.skills)).toBe(true);
    expect(portfolioData.sections.about.content.achievements).toBeDefined();
    expect(Array.isArray(portfolioData.sections.about.content.achievements)).toBe(true);
  });

  test('resume section data is valid', () => {
    expect(portfolioData.sections.resume).toBeDefined();
    expect(portfolioData.sections.resume.content.experience).toBeDefined();
    expect(Array.isArray(portfolioData.sections.resume.content.experience)).toBe(true);
    expect(portfolioData.sections.resume.content.education).toBeDefined();
    expect(Array.isArray(portfolioData.sections.resume.content.education)).toBe(true);
  });
});

describe('Data Mapping Functions', () => {
  test('can map video data correctly', () => {
    const mappedVideos = portfolioData.videos.fullLength.map((video: any) => ({
      id: video.id,
      name: video.title,
      type: 'video',
      url: video.url
    }));

    expect(mappedVideos.length).toBe(portfolioData.videos.fullLength.length);
    mappedVideos.forEach(video => {
      expect(video.id).toBeDefined();
      expect(video.name).toBeDefined();
      expect(video.type).toBe('video');
      expect(video.url).toBeDefined();
    });
  });

  test('can map project data correctly', () => {
    const mappedProjects = portfolioData.sections.work.projects.map((project: any) => ({
      id: project.id,
      name: project.name,
      type: 'project',
      url: project.link
    }));

    expect(mappedProjects.length).toBe(portfolioData.sections.work.projects.length);
    mappedProjects.forEach(project => {
      expect(project.id).toBeDefined();
      expect(project.name).toBeDefined();
      expect(project.type).toBe('project');
      expect(project.url).toBeDefined();
    });
  });

  test('handles empty arrays gracefully', () => {
    const emptyArray: any[] = [];
    
    expect(() => {
      emptyArray.map(item => ({ id: item.id, name: item.name }));
    }).not.toThrow();
    
    const result = emptyArray.map(item => ({ id: item.id, name: item.name }));
    expect(result).toEqual([]);
  });

  test('handles undefined data gracefully', () => {
    const undefinedData: any = undefined;
    
    expect(() => {
      if (undefinedData && Array.isArray(undefinedData)) {
        undefinedData.map((item: any) => ({ id: item.id, name: item.name }));
      }
    }).not.toThrow();
    
    const result = undefinedData && Array.isArray(undefinedData) 
      ? undefinedData.map((item: any) => ({ id: item.id, name: item.name }))
      : undefined;
    expect(result).toBeUndefined();
  });
});

describe('Error Handling', () => {
  test('validates data types', () => {
    expect(typeof portfolioData.profile.name).toBe('string');
    expect(typeof portfolioData.profile.title).toBe('string');
    expect(typeof portfolioData.profile.bio).toBe('string');
  });

  test('validates array lengths', () => {
    expect(portfolioData.videos.fullLength.length).toBeGreaterThan(0);
    expect(portfolioData.videos.shorts.length).toBeGreaterThan(0);
    expect(portfolioData.sections.work.projects.length).toBeGreaterThan(0);
    expect(portfolioData.sections.about.content.skills.length).toBeGreaterThan(0);
    expect(portfolioData.sections.about.content.achievements.length).toBeGreaterThan(0);
  });

  test('validates URL formats', () => {
    portfolioData.videos.fullLength.forEach(video => {
      expect(video.url).toMatch(/^https?:\/\//);
    });

    portfolioData.videos.shorts.forEach(video => {
      expect(video.url).toMatch(/^https?:\/\//);
    });

    portfolioData.sections.work.projects.forEach(project => {
      expect(project.link).toMatch(/^https?:\/\//);
    });
  });
});

describe('Navigation Logic', () => {
  test('dock item mapping works correctly', () => {
    const dockItems = [
      { id: 'finder', name: 'Finder' },
      { id: 'work', name: 'Work Projects' },
      { id: 'resume', name: 'Resume' },
      { id: 'youtube-videos', name: 'YouTube Videos' },
      { id: 'youtube-shorts', name: 'YouTube Shorts' },
      { id: 'about', name: 'About Me' }
    ];

    dockItems.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.name).toBeDefined();
      expect(typeof item.id).toBe('string');
      expect(typeof item.name).toBe('string');
    });
  });

  test('section navigation logic', () => {
    const sections = ['work', 'about', 'resume'];
    
    sections.forEach(section => {
      expect(portfolioData.sections[section as keyof typeof portfolioData.sections]).toBeDefined();
    });
  });

  test('file explorer data structure', () => {
    const fileExplorerData = {
      title: 'Portfolio Explorer',
      folders: [
        {
          id: 'work',
          name: 'Work Projects',
          type: 'work',
          items: portfolioData.sections.work.projects.map((project: any) => ({
            id: project.id,
            name: project.name,
            type: 'project',
            url: project.link
          }))
        },
        {
          id: 'youtube-videos',
          name: 'YouTube Videos',
          type: 'youtube',
          items: portfolioData.videos.fullLength.map((video: any) => ({
            id: video.id,
            name: video.title,
            type: 'video',
            url: video.url
          }))
        }
      ]
    };

    expect(fileExplorerData.title).toBe('Portfolio Explorer');
    expect(fileExplorerData.folders.length).toBe(2);
    expect(fileExplorerData.folders[0].items.length).toBeGreaterThan(0);
    expect(fileExplorerData.folders[1].items.length).toBeGreaterThan(0);
  });
});
