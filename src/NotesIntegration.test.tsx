import portfolioData from './data/portfolioData.json';

describe('Notes Integration Tests', () => {
  test('portfolio data includes detailed about information', () => {
    expect(portfolioData.profile.detailedAbout).toBeDefined();
    expect(portfolioData.profile.detailedAbout).toContain('Alex Thompson');
    expect(portfolioData.profile.detailedAbout).toContain('Los Angeles');
    expect(portfolioData.profile.detailedAbout).toContain('alex@techvloggerpro.com');
    expect(portfolioData.profile.detailedAbout).toContain('+1 (555) 123-4567');
  });

  test('project data can be formatted for notes', () => {
    const project = portfolioData.sections.work.projects[0];
    
    expect(project.name).toBeDefined();
    expect(project.type).toBeDefined();
    expect(project.description).toBeDefined();
    expect(project.link).toBeDefined();
    
    // Test notes content formatting
    const notesContent = `📁 ${project.name}\n\n📋 Project Type: ${project.type}\n\n📝 Description:\n${project.description}\n\n🏷️ Tags:\n${project.tags?.join(', ') || 'N/A'}\n\n📊 Statistics:\n${Object.entries(project.stats || {}).map(([key, value]) => `• ${key}: ${value}`).join('\n')}\n\n🔗 Link: ${project.link}`;
    
    expect(notesContent).toContain(project.name);
    expect(notesContent).toContain(project.description);
    expect(notesContent).toContain(project.link);
  });

  test('all projects have required data for notes', () => {
    portfolioData.sections.work.projects.forEach(project => {
      expect(project.name).toBeDefined();
      expect(project.type).toBeDefined();
      expect(project.description).toBeDefined();
      expect(project.link).toBeDefined();
      expect(typeof project.name).toBe('string');
      expect(typeof project.type).toBe('string');
      expect(typeof project.description).toBe('string');
      expect(typeof project.link).toBe('string');
    });
  });

  test('notes content formatting works for all projects', () => {
    portfolioData.sections.work.projects.forEach(project => {
      const notesContent = `📁 ${project.name}\n\n📋 Project Type: ${project.type}\n\n📝 Description:\n${project.description}\n\n🏷️ Tags:\n${project.tags?.join(', ') || 'N/A'}\n\n📊 Statistics:\n${Object.entries(project.stats || {}).map(([key, value]) => `• ${key}: ${value}`).join('\n')}\n\n🔗 Link: ${project.link}`;
      
      expect(notesContent.length).toBeGreaterThan(0);
      expect(notesContent).toContain('📁');
      expect(notesContent).toContain('📋');
      expect(notesContent).toContain('📝');
      expect(notesContent).toContain('🔗');
    });
  });

  test('about me content is properly formatted', () => {
    const aboutContent = portfolioData.profile.detailedAbout;
    
    expect(aboutContent).toContain('👋');
    expect(aboutContent).toContain('📍');
    expect(aboutContent).toContain('📧');
    expect(aboutContent).toContain('📱');
    expect(aboutContent).toContain('🌐');
    expect(aboutContent).toContain('💼');
    expect(aboutContent).toContain('🎯');
    expect(aboutContent).toContain('🛠️');
    expect(aboutContent).toContain('🏆');
    expect(aboutContent).toContain('🎓');
    expect(aboutContent).toContain('🌟');
    expect(aboutContent).toContain('📈');
  });

  test('contact information is included in about content', () => {
    const aboutContent = portfolioData.profile.detailedAbout;
    
    expect(aboutContent).toContain('Los Angeles, California');
    expect(aboutContent).toContain('alex@techvloggerpro.com');
    expect(aboutContent).toContain('+1 (555) 123-4567');
    expect(aboutContent).toContain('https://alexthompson.dev');
  });

  test('professional summary is comprehensive', () => {
    const aboutContent = portfolioData.profile.detailedAbout;
    
    expect(aboutContent).toContain('video editor');
    expect(aboutContent).toContain('creative storyteller');
    expect(aboutContent).toContain('5 years');
    expect(aboutContent).toContain('UCLA');
    expect(aboutContent).toContain('digital content creation');
  });

  test('skills and achievements are listed', () => {
    const aboutContent = portfolioData.profile.detailedAbout;
    
    // Technical skills
    expect(aboutContent).toContain('Adobe Creative Suite');
    expect(aboutContent).toContain('Premiere Pro');
    expect(aboutContent).toContain('After Effects');
    expect(aboutContent).toContain('DaVinci Resolve');
    expect(aboutContent).toContain('Final Cut Pro');
    
    // Achievements
    expect(aboutContent).toContain('100M+ Total Views');
    expect(aboutContent).toContain('YouTube Creator Award');
    expect(aboutContent).toContain('Adobe Certified Expert');
  });

  test('file explorer data structure supports notes', () => {
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
            url: project.link,
            notesContent: `📁 ${project.name}\n\n📋 Project Type: ${project.type}\n\n📝 Description:\n${project.description}`
          }))
        }
      ]
    };

    expect(fileExplorerData.folders[0].items.length).toBeGreaterThan(0);
    fileExplorerData.folders[0].items.forEach(item => {
      expect(item.notesContent).toBeDefined();
      expect(item.notesContent).toContain('📁');
      expect(item.notesContent).toContain(item.name);
    });
  });

  test('notes app data structure is valid', () => {
    const notesData = {
      title: 'About Me',
      content: portfolioData.profile.detailedAbout,
      type: 'about' as const,
      onClose: () => {}
    };

    expect(notesData.title).toBe('About Me');
    expect(notesData.content).toBeDefined();
    expect(notesData.type).toBe('about');
    expect(typeof notesData.onClose).toBe('function');
  });

  test('project notes data structure is valid', () => {
    const project = portfolioData.sections.work.projects[0];
    const projectNotesData = {
      title: project.name,
      content: `📁 ${project.name}\n\n📝 Description:\n${project.description}`,
      type: 'project' as const,
      onClose: () => {}
    };

    expect(projectNotesData.title).toBe(project.name);
    expect(projectNotesData.content).toContain(project.name);
    expect(projectNotesData.content).toContain(project.description);
    expect(projectNotesData.type).toBe('project');
    expect(typeof projectNotesData.onClose).toBe('function');
  });
});
