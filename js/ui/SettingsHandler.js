(function (clc)
{
    /**
     * Class that corresponds for Cl Calc settings and settings dialog.
     * @constructor
     */
    clc.SettingsHandler = function (onSettingsChangedCallback)
    {
        this._onSettingsChangedCallback = onSettingsChangedCallback;

        this._elements =
        {
            'showSettingsDialogButton': $('#show-settings-dialog-button'),
            'settingsDialog':           $('#settings-dialog'),
            'outputNumberFormatSelect': $('#settings-dialog .output-number-format'),
            'thousandsSeparatorSelect': $('#settings-dialog .thousands-separator'),
            'precisionInput':           $('#settings-dialog .precision'),
            'colorThemeSelect':         $('#settings-dialog .color-theme'),
            'applySettingsButton':      $('#settings-dialog button.btn-primary')
        };

        // Default settings
        this._settings = {
            'precision': 64,
            'outputNumberFormat': 'fixed',
            'thousandsSeparatorEnabled': false,
            'colorTheme': 'light'
        };

        this._loadSettings();
        this._initializeUi();
    };

    /**
     * Get current settings.
     * @return {Object}
     */
    clc.SettingsHandler.prototype.getSettings = function ()
    {
        return this._settings;
    };

    /**
     * Load settings from browser local storage.
     * If no settings are present, default settings will be used.
     */
    clc.SettingsHandler.prototype._loadSettings = function ()
    {
        if (typeof window.localStorage !== 'undefined')
        {
            var outputNumberFormat = localStorage.getItem('outputNumberFormat'),
                thousandsSeparatorEnabled = localStorage.getItem('settingsThousandsSeparatorEnabled'),
                precision = localStorage.getItem('precision'),
                colorTheme = localStorage.getItem('colorTheme');

            if (outputNumberFormat !== null)
                this._settings.outputNumberFormat = outputNumberFormat;

            if (thousandsSeparatorEnabled !== null)
                this._settings.thousandsSeparatorEnabled = (thousandsSeparatorEnabled === 'true');

            if (precision !== null)
                this._settings.precision = parseInt(precision, 10);

            if (colorTheme !== null)
                this._settings.colorTheme = colorTheme;
        }
    };

    /**
     * Save current settings to browser local storage.
     */
    clc.SettingsHandler.prototype._saveSettings = function ()
    {
        if (typeof window.localStorage !== 'undefined')
        {
            localStorage.setItem('outputNumberFormat', this._settings.outputNumberFormat);
            localStorage.setItem('settingsThousandsSeparatorEnabled', this._settings.thousandsSeparatorEnabled);
            localStorage.setItem('precision', this._settings.precision);
            localStorage.setItem('colorTheme', this._settings.colorTheme);
        }
    };

    /**
     * Initialize settings handler UI.
     */
    clc.SettingsHandler.prototype._initializeUi = function ()
    {
        var self = this;

        // Initialize settings dialog
        this._elements.settingsDialog.modal({
            'backdrop': true,
            'keyboard': true,
            'show':     false
        });

        this._elements.settingsDialog.on('show.bs.modal', function()
        {
            self._elements.showSettingsDialogButton.addClass('active');
        });

        this._elements.settingsDialog.on('hidden.bs.modal', function()
        {
            self._elements.showSettingsDialogButton.removeClass('active');
        });

        this._elements.applySettingsButton.click(function ()
        {
            self._applySettings();
        });

        // Initialize show settings dialog button
        this._elements.showSettingsDialogButton.click(function ()
        {
            self._showDialog();
        });
    };

    /**
     * Show settings dialog with current settings.
     */
    clc.SettingsHandler.prototype._showDialog = function ()
    {
        // Set current settings into dialog
        this._elements.outputNumberFormatSelect.val(this._settings.outputNumberFormat);
        this._elements.thousandsSeparatorSelect.val(this._settings.thousandsSeparatorEnabled ? 'enabled': 'disabled');
        this._elements.precisionInput.val(this._settings.precision);
        this._elements.colorThemeSelect.val(this._settings.colorTheme);

        // Show dialog
        this._elements.settingsDialog.modal('show');
    };

    /**
     * Hide settings dialog.
     */
    clc.SettingsHandler.prototype._hideDialog = function ()
    {
        this._elements.settingsDialog.modal('hide');
    };

    /**
     * Apply and save settings from the dialog.
     */
    clc.SettingsHandler.prototype._applySettings = function ()
    {
        // Set current settings
        this._settings.outputNumberFormat = this._elements.outputNumberFormatSelect.val();

        this._settings.thousandsSeparatorEnabled = (this._elements.thousandsSeparatorSelect.val() === 'enabled' ? true : false);

        var precision;
        try
        {
            precision = parseInt(this._elements.precisionInput.val());
            if (!isFinite(precision))
                throw new Error('Precision is ' + precision);
        }
        catch(e)
        {
            clc.log(e);
            precision = this._settings.precision;
        }

        this._settings.precision = clc.clamp(precision, 8, 4096);
        this._settings.colorTheme = this._elements.colorThemeSelect.val();

        // Save settings to browser local storage
        this._saveSettings();

        // Hide dialog
        this._hideDialog();

        // Notify of settings changed
        this._onSettingsChangedCallback();
    };
}(window.clc = window.clc || {}));
