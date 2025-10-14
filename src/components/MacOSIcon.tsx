import React from 'react';

interface MacOSIconProps {
  name: string;
  size?: number;
  alt?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
}

// Icon mapping for consistent naming
const iconMap: { [key: string]: string } = {
  // File system icons
  'folder': 'Folder.png',
  'document': 'Document.png',
  'finder': 'Finder.png',
  
  // Application icons
  'notes': 'Notes.png',
  'calculator': 'Calculator.png',
  'calendar': 'Calendar.png',
  'contacts': 'Contacts.png',
  'mail': 'Mail.png',
  'safari': 'Safari.png',
  'settings': 'Settings.png',
  'terminal': 'Terminal.png',
  'textedit': 'TextEdit.png',
  'preview': 'Preview.png',
  'photos': 'Photos.png',
  'music': 'Music.png',
  'tv': 'TV.png',
  'app-store': 'App Store.png',
  'launchpad': 'Launchpad.png',
  'mission-control': 'Mission Control.png',
  
  // Creative apps
  'final-cut-pro': 'Final Cut Pro.png',
  'imovie': 'iMovie.png',
  'garageband': 'GarageBand.png',
  'keynote': 'Keynote.png',
  'pages': 'Pages.png',
  'numbers': 'Numbers.png',
  'figma': 'Figma.png',
  'xcode': 'Xcode.png',
  
  // Communication
  'facetime': 'FaceTime.png',
  'messages': 'Messages.png',
  'news': 'News.png',
  'podcasts': 'Podcasts.png',
  
  // Utilities
  'activity-monitor': 'Activity Monitor.png',
  'disk-utility': 'Disk Utility.png',
  'keychain-access': 'Keychain Access.png',
  'system-information': 'System Information.png',
  'time-machine': 'Time Machine.png',
  'console': 'Console.png',
  'screenshot': 'Screenshot.png',
  
  // Media
  'quicktime': 'QuickTime Player.png',
  'photo-booth': 'Photo Booth.png',
  'voice-memos': 'Voice Memos.png',
  
  // Productivity
  'reminders': 'Reminders.png',
  'stickies': 'Stickies.png',
  'dictionary': 'Dictionary.png',
  'font-book': 'Font Book.png',
  'books': 'Books.png',
  
  // System
  'trash-empty': 'Trash Empty.png',
  'trash-full': 'Trash Full.png',
  'home': 'Home.png',
  'find-my': 'Find My.png',
  'siri': 'Siri.png',
  'shortcuts': 'Shortcuts.png',
  'weather': 'Weather.png',
  'stocks': 'Stocks.png',
  'maps': 'Maps.png',
  'clock': 'Clock.png',
  
  // Work/Professional
  'work': 'Folder.png', // Use folder for work projects
  'video': 'QuickTime Player.png',
  'youtube': 'QuickTime Player.png',
  'shorts': 'iMovie.png',
  'project': 'Document.png',
  'resume': 'Document.png',
  'about': 'Contacts.png',
  'info': 'System Information.png',
  'person': 'Contacts.png',
  'description': 'Document.png',
  'video-library': 'QuickTime Player.png',
  'movie': 'iMovie.png',
};

const MacOSIcon: React.FC<MacOSIconProps> = ({ 
  name, 
  size = 32, 
  alt, 
  style = {}, 
  onClick,
  className = '' 
}) => {
  const iconFileName = iconMap[name.toLowerCase()] || iconMap['document'];
  const iconPath = `/mac-icons/${iconFileName}`;
  
  const iconStyle: React.CSSProperties = {
    width: size,
    height: size,
    objectFit: 'contain',
    userSelect: 'none',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease',
    ...style
  };

  // Hover effects are handled via onMouseEnter/onMouseLeave events

  return (
    <img
      src={iconPath}
      alt={alt || name}
      style={iconStyle}
      onClick={onClick}
      className={`macos-icon ${className}`}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      draggable={false}
    />
  );
};

export default MacOSIcon;
