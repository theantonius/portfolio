---
id: ai-scheduler
title: NYC FIRST Schedule & Events
summary: Staff update events and hours in Monday.com; automated workflows publish changes to the website and events to Google Calendar.
year: "2026"
medium: Workflow Automation, n8n, Monday.com, Webflow, Google Calendar, JavaScript
category: project
thumbnail: https://img.antoni.us/scheduler/scheduler-thumb.png
hero: https://img.antoni.us/scheduler/scheduler-hero.png
previewVideo: https://img.antoni.us/scheduler/scheduler-workflow-v2.mp4
heroVideo: https://img.antoni.us/scheduler/scheduler-workflow-v2.mp4
gallery:
  - thumb: https://img.antoni.us/scheduler/scheduler-01-thumb.png
    full: https://img.antoni.us/scheduler/scheduler-01-full.png
    caption: "Public events page with filters, registration links and calendar subscriptions."
  - thumb: https://img.antoni.us/scheduler/scheduler-02-thumb.png
    full: https://img.antoni.us/scheduler/scheduler-02-full.png
    caption: "Events Calendar Workflow: Monday.com, n8n, Webflow, the public website and Google Calendar."
  - thumb: https://img.antoni.us/scheduler/scheduler-03-thumb.png
    full: https://img.antoni.us/scheduler/scheduler-03-full.png
    caption: "n8n publishes event changes to Webflow and Google Calendar and writes their IDs back to Monday.com."
  - thumb: https://img.antoni.us/scheduler/scheduler-04-thumb.png
    full: https://img.antoni.us/scheduler/scheduler-04-full.png
    caption: "Published events appear on the shared and relevant STEM Center calendars."
  - thumb: https://img.antoni.us/scheduler/scheduler-05-thumb.png
    full: https://img.antoni.us/scheduler/scheduler-05-full.png
    caption: "Staff update weekly hours in Monday.com; the public walk-in hours update through n8n and Webflow."
links:
  - label: GitHub
    url: https://github.com/NYC-FIRST/nycfirst-schedule
  - label: Live calendar
    url: https://www.nycfirst.org/calendar-events
---


NYC FIRST staff needed a way to manage events, STEM Center hours, closures, and schedule changes without maintaining the same information across multiple platforms. Working with colleagues, I helped build a publishing system connecting Monday.com, n8n, Webflow, and Google Calendar.

Staff submit and review updates in Monday.com. Self-hosted n8n workflows publish approved events to the website and calendars, while regular hours and schedule exceptions keep public opening information current. The public interface includes current open/closed status, event filters, registration links, and calendar subscriptions, using custom JavaScript and CSS hosted on Cloudflare Pages.

The system launched in September 2026. Subsequent optimization reduced event publishing from roughly 1–2 minutes to about nine seconds and reduced Monday.com API calls from about 1,138 to six per publish.
