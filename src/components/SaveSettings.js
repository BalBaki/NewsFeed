import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSaveSettingsMutation } from '../store';
import { useNotification } from '../hooks/use-notification';

function SaveSettings({ settings }) {
    const user = useSelector(({ user }) => user);
    const [saveSettings, saveSettingsResult] = useSaveSettingsMutation();
    const notification = useNotification();

    const { searchTerm, ...rest } = settings;

    useEffect(() => {
        if (saveSettingsResult.data) {
            notification({
                type: saveSettingsResult.data.save ? 'success' : 'error',
                messages: saveSettingsResult.data.save ? 'Settings Saved' : 'Error at Save',
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveSettingsResult]);

    const handleSaveClick = () => {
        saveSettings({
            id: user.id,
            token: document.cookie.match(`(^|;)\\s*token\\s*=\\s*([^;]+)`)?.pop() || '',
            settings: rest,
        });
    };

    return (
        <div>
            <button
                className="bg-green-400 w-36 h-7 rounded-md text-white ml-2 max-[300px]:ml-0 max-[300px]:mt-2"
                disabled={saveSettingsResult.isLoading}
                onClick={handleSaveClick}
            >
                {saveSettingsResult.isLoading ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
    );
}

export default SaveSettings;
