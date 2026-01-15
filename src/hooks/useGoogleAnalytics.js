// Custom hook untuk Google Analytics
import { useEffect } from "react";

// Google Analytics Tracking ID
const GA_TRACKING_ID = "G-E5NR76E3JV";

export const useGoogleAnalytics = () => {
	useEffect(() => {
		// Initialize Google Analytics if not already loaded
		if (typeof window.gtag !== "function") {
			console.warn("Google Analytics not loaded");
			return;
		}

		// Track page view
		window.gtag("config", GA_TRACKING_ID, {
			page_title: document.title,
			page_location: window.location.href,
		});
	}, []);

	// Function to track events
	const trackEvent = (eventName, eventParams = {}) => {
		if (typeof window.gtag === "function") {
			window.gtag("event", eventName, {
				event_category: "User Interaction",
				...eventParams,
			});
		}
	};

	// Function to track page views
	const trackPageView = (pagePath, pageTitle) => {
		if (typeof window.gtag === "function") {
			window.gtag("config", GA_TRACKING_ID, {
				page_path: pagePath,
				page_title: pageTitle,
			});
		}
	};

	return {
		trackEvent,
		trackPageView,
	};
};

// Utility functions for tracking specific events
export const trackButtonClick = (buttonName, section = "") => {
	if (typeof window.gtag === "function") {
		window.gtag("event", "click", {
			event_category: "Button",
			event_label: buttonName,
			custom_section: section,
		});
	}
};

export const trackSectionView = (sectionName) => {
	if (typeof window.gtag === "function") {
		window.gtag("event", "section_view", {
			event_category: "Engagement",
			event_label: sectionName,
		});
	}
};

export const trackDownload = (fileName, fileType) => {
	if (typeof window.gtag === "function") {
		window.gtag("event", "file_download", {
			event_category: "Download",
			event_label: fileName,
			file_type: fileType,
		});
	}
};

export const trackOutboundLink = (linkUrl, linkText) => {
	if (typeof window.gtag === "function") {
		window.gtag("event", "click", {
			event_category: "Outbound Link",
			event_label: linkUrl,
			link_text: linkText,
		});
	}
};

export const trackFormSubmit = (formName, formType = "contact") => {
	if (typeof window.gtag === "function") {
		window.gtag("event", "form_submit", {
			event_category: "Form",
			event_label: formName,
			form_type: formType,
		});
	}
};

// Enhanced visitor statistics tracking
export const trackVisitorEngagement = (action, details = {}) => {
	if (typeof window.gtag === "function") {
		window.gtag("event", "visitor_engagement", {
			event_category: "Engagement",
			action: action,
			...details,
		});
	}
};

export default useGoogleAnalytics;
