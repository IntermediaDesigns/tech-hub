import ThemeSettings from '../components/settings/ThemeSettings';
import VideoShare from '../components/videos/VideoShare';

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <ThemeSettings />
      <VideoShare /> {/* Add VideoShare component */}
    </div>
  );
}
