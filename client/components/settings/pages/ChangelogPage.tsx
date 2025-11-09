import React from 'react';

const changelog = [
  {
    version: '1.1.0',
    date: new Date().toLocaleDateString(),
    changes: [
      'Privacy toggles now block DMs and friend requests',
      'Voice slider is now accessible and functional',
      'Notification toggles request browser permissions',
      'Text & Images toggles control link previews and emoji',
      'Theme and font-size apply immediately',
      'Reduced motion toggle disables animations',
      'Keybind recording supports Escape to cancel',
      'Advanced toggles control developer features',
      'Language selector with 15+ languages',
      'All settings persist to database'
    ]
  },
  {
    version: '1.0.0',
    date: '2024-01-01',
    changes: [
      'Initial release',
      'User profiles with avatar and bio',
      'Settings management',
      'Voice channels',
      'Direct messaging'
    ]
  }
];

export function ChangelogPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Changelog</h2>
        <p className="text-discord-muted">Recent updates and changes</p>
      </div>

      <div className="space-y-6">
        {changelog.map((entry, idx) => (
          <div key={idx} className="border-l-2 border-primary pl-4">
            <h3 className="text-lg font-semibold text-white">Version {entry.version}</h3>
            <p className="text-sm text-discord-muted mb-2">Released: {entry.date}</p>
            <ul className="list-disc list-inside text-discord-muted space-y-1">
              {entry.changes.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
