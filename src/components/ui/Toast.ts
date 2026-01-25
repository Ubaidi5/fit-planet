const svg = {
  success: `
      <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 512 512"
      height="19px"
      width="19px"
      xmlns="http://www.w3.org/2000/svg"
      style="color: #ffffff; flex-shrink: 0;"
    >
      <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
    </svg>
    `,
  loading: `
    <svg
      class="rotate-360"
      stroke="#ffffff"
      fill="#ffffff"
      stroke-width="0"
      viewBox="0 0 1024 1024"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      style="flex-shrink: 0;"
    >
      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
    </svg>
  `,
  error: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style="flex-shrink: 0;">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.7679 0.767755C10.7916 -0.208556 9.20865 -0.208555 8.23234 0.767756L0.767877 8.23222C-0.208434 9.20853 -0.208432 10.7914 0.767878 11.7678L8.23234 19.2322C9.20865 20.2085 10.7916 20.2085 11.7679 19.2322L19.2323 11.7678C20.2087 10.7914 20.2087 9.20853 19.2323 8.23222L11.7679 0.767755ZM9.00005 5.99999C9.00005 5.4477 9.44776 4.99999 10 4.99999C10.5523 4.99999 11 5.4477 11 5.99999V9.99999C11 10.5523 10.5523 11 10 11C9.44776 11 9.00005 10.5523 9.00005 9.99999V5.99999ZM11 14C11 14.5523 10.5523 15 10 15C9.44776 15 9.00005 14.5523 9.00005 14C9.00005 13.4477 9.44776 13 10 13C10.5523 13 11 13.4477 11 14Z"
        fill="#ffffff"
      />
    </svg>
  `,
  warning: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
      <path
        d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#ffffff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  `,
  info: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
      <path
        d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="#ffffff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  `,
};

// Message configuration interface matching Ant Design API
interface ToastConfig {
  content?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties | string;
  onClose?: () => void;
  onClick?: () => void;
}

// Message parameter types - supports both string and object like Ant Design
type ToastParam = string | ToastConfig;

class Message {
  private messageCounter = 0;

  private createWrapper() {
    let wrapper = document.getElementById("message-wrapper");

    if (wrapper == null) {
      wrapper = document.createElement("div");
      wrapper.setAttribute("id", "message-wrapper");
      wrapper.style.cssText = `
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999999;
          pointer-events: none;
        `;
      document.body.append(wrapper);
    }

    return wrapper;
  }

  private parseToastParam(param: ToastParam): ToastConfig {
    if (typeof param === "string") {
      return { content: param };
    }
    return param;
  }

  private createDiv(
    type: "success" | "loading" | "error" | "warning" | "info",
    config: ToastConfig,
  ) {
    const div = document.createElement("div");
    const messageId = `message-${++this.messageCounter}`;
    div.setAttribute("id", messageId);

    // Apply custom className if provided
    if (config.className) {
      div.className = config.className;
    }

    // Base styles - Dark theme by default
    let baseStyles = `
         display: flex;
         align-items: center;
         justify-content: center;
         box-shadow: 0 6px 16px 0 rgb(0 0 0 / 20%), 0 3px 6px -4px rgb(0 0 0 / 35%), 0 9px 28px 8px rgb(0 0 0 / 15%);
         border-radius: 8px;
         padding: 12px 16px;
         margin: 8px auto;
         width: 100%;
         max-width: 500px;
         font-size: 14px;
         line-height: 1.5715;
         font-weight: 400;
         pointer-events: auto;
         cursor: pointer;
         transition: all 0.3s ease;
         animation: messageSlideDown 0.3s ease-out;
         backdrop-filter: blur(8px);
         border: none;
    `;

    // Type-specific styles - True dark theme with white text
    switch (type) {
      case "success":
        baseStyles += `
          color: #ffffff;
          background: #2e3d4d;
        `;
        break;
      case "error":
        baseStyles += `
          color: #ffffff;
          background: linear-gradient(135deg, #c62828, #d32f2f);
        `;
        break;
      case "loading":
        baseStyles += `
          color: #ffffff;
          background: linear-gradient(135deg, #1565c0, #1976d2);
        `;
        break;
      case "warning":
        baseStyles += `
          color: #ffffff;
          background: linear-gradient(135deg, #f57c00, #ff9800);
        `;
        break;
      case "info":
        baseStyles += `
          color: #ffffff;
          background: linear-gradient(135deg, #0277bd, #0288d1);
        `;
        break;
    }

    // Apply custom styles if provided
    if (config.style) {
      if (typeof config.style === "string") {
        baseStyles += config.style;
      } else {
        // Convert React.CSSProperties to string
        const styleString = Object.entries(config.style)
          .map(
            ([key, value]) =>
              `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${value}`,
          )
          .join("; ");
        baseStyles += styleString;
      }
    }

    div.style.cssText = baseStyles;

    // Add icon and content
    div.innerHTML = `
      ${svg[type]}
      <span style="margin-left: 8px; word-break: break-word;">${config.content || ""}</span>
    `;

    // Add click handler if provided
    if (config.onClick) {
      div.addEventListener("click", config.onClick);
    }

    // Add CSS animation keyframes if not already added
    if (!document.getElementById("message-animations")) {
      const style = document.createElement("style");
      style.id = "message-animations";
      style.textContent = `
        @keyframes messageSlideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes messageSlideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        .message-slide-out {
          animation: messageSlideUp 0.3s ease-out forwards;
        }
        .rotate-360 {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    return { div, messageId };
  }

  private showToast(
    div: HTMLDivElement,
    messageId: string,
    config: ToastConfig,
  ) {
    const wrapper = this.createWrapper();
    wrapper.appendChild(div);

    const duration = config.duration !== undefined ? config.duration : 3; // Default 3 seconds like Ant Design

    // Auto-hide message after duration (if duration is not 0)
    if (duration > 0) {
      setTimeout(() => {
        this.hideMessage(messageId, config.onClose);
      }, duration * 1000);
    }

    // Return a function to manually hide the message
    return () => this.hideMessage(messageId, config.onClose);
  }

  private hideMessage(messageId: string, onClose?: () => void) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.classList.add("message-slide-out");

      setTimeout(() => {
        const wrapper = document.getElementById("message-wrapper");
        if (wrapper && messageElement.parentNode === wrapper) {
          wrapper.removeChild(messageElement);

          // Remove wrapper if no more messages
          if (wrapper.children.length === 0) {
            document.body.removeChild(wrapper);
          }
        }

        // Call onClose callback if provided
        if (onClose) {
          onClose();
        }
      }, 300); // Match animation duration
    }
  }

  public success(param: ToastParam) {
    const config = this.parseToastParam(param);
    const { div, messageId } = this.createDiv("success", config);
    return this.showToast(div, messageId, config);
  }

  public loading(param: ToastParam) {
    const config = this.parseToastParam(param);
    const { div, messageId } = this.createDiv("loading", config);
    return this.showToast(div, messageId, config);
  }

  public error(param: ToastParam) {
    const config = this.parseToastParam(param);
    const { div, messageId } = this.createDiv("error", config);
    return this.showToast(div, messageId, config);
  }

  // Additional utility methods like Ant Design
  public info(param: ToastParam) {
    const config = this.parseToastParam(param);
    const { div, messageId } = this.createDiv("info", config);
    return this.showToast(div, messageId, config);
  }

  public warning(param: ToastParam) {
    const config = this.parseToastParam(param);
    const { div, messageId } = this.createDiv("warning", config);
    return this.showToast(div, messageId, config);
  }

  // Destroy all messages
  public destroy() {
    const wrapper = document.getElementById("message-wrapper");
    if (wrapper) {
      document.body.removeChild(wrapper);
    }
  }
}

const toast = new Message();

// Export types for TypeScript usage
export type { ToastConfig, ToastParam };

export default toast;
