import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useOnboarding = () => {
  const startHomeTour = () => {
    // Show once per user/browser
    if (localStorage.getItem('gcc_home_tour_v1')) return;
    
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      popoverClass: 'gcc-tour-theme', // We will add custom styles for dark mode
      steps: [
        {
          element: '#hero-title',
          popover: {
            title: 'Welcome to GCC',
            description: 'This is the GAT Coding Club platform. Let us show you around our new and improved ecosystem!'
          }
        },
        {
          element: '#navbar-user-section, #navbar-auth-button',
          popover: {
            title: 'Account & Membership',
            description: "This is where you can manage your profile, view your stats, or join the club if you haven't already!"
          }
        },
        {
          element: '#domains',
          popover: {
            title: 'Club Domains',
            description: 'These are our specialized technical sectors. You can explore and join the ones that match your interests.'
          }
        },
        {
          element: '#events',
          popover: {
            title: 'Latest Activities',
            description: 'Stay updated with upcoming hackathons, workshops, and meetups. Register directly from here!'
          }
        },
        {
          element: '#live-rooms-preview',
          popover: {
            title: 'The Arena',
            description: 'Join live voice, video, and screen-sharing sessions with other members. Think of it as our internal Discord!'
          }
        },
        {
          element: '#leaderboard',
          popover: {
            title: 'Global Rankings',
            description: 'Compete with others and climb the leaderboard by earning XP from events and quizzes!'
          }
        }
      ],
      onDestroyStarted: () => {
        localStorage.setItem('gcc_home_tour_v1', 'true');
        driverObj.destroy();
      }
    });

    // Slight delay to ensure DOM and animations are ready
    setTimeout(() => {
      driverObj.drive();
    }, 2500);
  };

  const startCodingHubTour = () => {
    if (localStorage.getItem('gcc_codinghub_tour_v1')) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      popoverClass: 'gcc-tour-theme',
      steps: [
        {
          element: '#workspace-editor',
          popover: {
            title: 'Real-time Workspace',
            description: 'This is your code editor. Everything you type here syncs in real-time with everyone else in the room!'
          }
        },
        {
          element: '#workspace-sidebar',
          popover: {
            title: 'Files & Activity',
            description: 'Switch between files, see active members, and chat with your peers here.'
          }
        },
        {
          element: '#run-code-btn',
          popover: {
            title: 'Execute Code',
            description: 'Click here to run your code against our secure cloud engine (Judge0).'
          }
        },
        {
          element: '#output-terminal',
          popover: {
            title: 'Terminal & Output',
            description: 'View your execution results, errors, and server logs right here.'
          }
        }
      ],
      onDestroyStarted: () => {
        localStorage.setItem('gcc_codinghub_tour_v1', 'true');
        driverObj.destroy();
      }
    });

    setTimeout(() => {
      driverObj.drive();
    }, 1500);
  };

  return { startHomeTour, startCodingHubTour };
};
