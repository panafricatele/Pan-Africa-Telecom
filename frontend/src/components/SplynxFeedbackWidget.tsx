import { useEffect } from 'react';

declare global {
  interface Window {
    SplynxFeedbackWidget?: { init: (config: Record<string, unknown>) => void };
  }
}

let splynxWidgetInitialized = false;

export default function SplynxFeedbackWidget() {
  useEffect(() => {
    if (splynxWidgetInitialized) return;
    splynxWidgetInitialized = true;

    const scriptUrl = 'https://portal.panafricatelecom.co.za/js/development/widgets/feedback.js';
    const params = {
      widgetType: 'popup',
      scriptUrl,
      buttonType: 'text',
      buttonBg: '#d22f4c',
      buttonText: 'Support',
      buttonTextColor: '#000000',
      buttonAlignment: 'left',
      buttonOffset: '150',
      formTitle: 'Pan%20Africa%20Telecom%20-%20Support',
      submitTitle: 'Send',
      submitThanks: 'Thank%20you%20for%20reaching%20out%20to%20us',
      url: 'https://portal.panafricatelecom.co.za',
      defaultPriority: 'medium',
      showPriority: 1,
      defaultType: 'undefined',
      showType: 1,
      attachFile: 1,
      queryString:
        'widgetType=popup&formTitle=Pan%20Africa%20Telecom%20-%20Support&submitTitle=Send&submitThanks=Thank%20you%20for%20reaching%20out%20to%20us&showPriority=1&defaultPriority=medium&showType=1&defaultType=undefined&attachFile=1',
    };

    let script = document.getElementById('splynx_feedback_script') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'splynx_feedback_script';
      script.src = scriptUrl;
      document.body.appendChild(script);
    }

    if (typeof window.SplynxFeedbackWidget === 'undefined') {
      script.addEventListener('load', () => {
        window.SplynxFeedbackWidget?.init(params);
      });
    } else {
      window.SplynxFeedbackWidget.init(params);
    }
  }, []);

  return null;
}
