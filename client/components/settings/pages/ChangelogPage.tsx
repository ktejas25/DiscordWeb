import React from 'react';

export function ChangelogPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Changelog</h2>
        <p className="text-discord-muted">Recent updates and changes</p>
      </div>

      <div className="space-y-4">
        <div className="border-l-2 border-primary pl-4">
          <h3 className="text-lg font-semibold text-white">Version 1.0.0</h3>
          <p className="text-sm text-discord-muted mb-2">Released: {new Date().toLocaleDateString()}</p>
          <ul className="list-disc list-inside text-discord-muted space-y-1">
            <li>Initial release</li>
            <li>User profiles with avatar and bio</li>
            <li>Settings management</li>
            <li>Voice channels</li>
            <li>Direct messaging</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
