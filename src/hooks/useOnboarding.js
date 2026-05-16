import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useNavigate } from "react-router-dom";

export const useOnboarding = () => {
  const navigate = useNavigate();
  const startHomeTour = (onStart, onEnd) => {
    // Show once per user/browser version
    const tourVersion = 'gcc_home_tour_v4';
    if (localStorage.getItem(tourVersion)) return;
    
    const isMobile = window.innerWidth < 768;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      popoverClass: 'gcc-tour-theme', 
      steps: [
        {
          element: isMobile ? '#mobile-hero-title' : '#hero-title',
          popover: {
            title: 'Welcome to GCC',
            description: 'This is the GAT Coding Club platform. Let us show you around our new and improved ecosystem!'
          }
        },
        {
          element: isMobile ? '#mobile-profile-link' : '#navbar-user-section, #navbar-auth-button',
          popover: {
            title: 'Account & Membership',
            description: "This is where you can manage your profile, view your stats, or join the club if you haven't already!",
            onNextClick: () => {
              if (isMobile) {
                const toggle = document.getElementById('mobile-menu-toggle');
                // Only click if it's currently OPEN (close it)
                if (toggle && toggle.getAttribute('data-open') === 'true') {
                  toggle.click();
                }
              }
              driverObj.moveNext();
            }
          },
          onHighlightStarted: (element) => {
            if (isMobile) {
              const toggle = document.getElementById('mobile-menu-toggle');
              // Only click if it's currently CLOSED
              if (toggle && toggle.getAttribute('data-open') === 'false') {
                toggle.click();
                // Give it a tiny moment to animate so the highlight lands correctly
                setTimeout(() => {
                  driverObj.refresh();
                }, 300);
              }
            }
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
      onDeselected: () => {
        // Global cleanup: Close drawer if open
        if (isMobile) {
          const toggle = document.getElementById('mobile-menu-toggle');
          if (toggle && toggle.getAttribute('data-open') === 'true') {
            toggle.click();
          }
        }
      },
      onDestroyStarted: () => {
        localStorage.setItem(tourVersion, 'true');
        if (onEnd) onEnd();
        driverObj.destroy();
      }
    });

    // Slight delay to ensure DOM and animations are ready
    setTimeout(() => {
      if (onStart) onStart();
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

  const startAdminTour = (onStart, onEnd) => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      popoverClass: 'gcc-tour-theme',
      steps: [
        // --- STEP 1: DASHBOARD ---
        {
          element: '#admin-stats-grid',
          popover: {
            title: 'Intelligence Dashboard',
            description: 'Monitor real-time stats on members, events, and total XP across the club. These cards update instantly as data flows in.',
            side: "bottom",
            align: 'start'
          }
        },
        // --- STEP 2: NAVIGATE TO USERS ---
        {
          element: '#sidebar-users',
          popover: {
            title: 'Member Management',
            description: 'This is where you manage the human core of the club. Click next to enter the Member Intelligence module.',
            side: "right",
            onNextClick: () => {
              navigate('/admin/users');
              setTimeout(() => {
                driverObj.moveNext();
              }, 500);
            }
          }
        },
        // --- STEP 3: USERS LIST & SEARCH ---
        {
          element: 'th:nth-child(1)', // Target the first header as a proxy for the table
          popover: {
            title: 'Member Directory',
            description: 'A high-performance list of all registered members. You can search by name or USN using the search bar at the top.',
            side: "bottom"
          }
        },
        // --- STEP 4: THREE DOTS (MORE ACTIONS) ---
        {
          element: '#user-more-actions',
          popover: {
            title: 'The "Three Dots" (Master Control)',
            description: 'This is the most important button. Clicking it opens the **Detailed Member Modal** where you can see full contact info, academic details, and academic history.',
            side: "left"
          }
        },
        // --- STEP 5: SYSTEM REMARKS EXPLANATION ---
        {
          element: '#user-more-actions', // Still pointing here as a reference
          popover: {
            title: 'Sticky System Remarks',
            description: 'Inside the modal (opened by the three dots), you can send **Sticky Remarks**. These are high-impact alerts that the user MUST see and acknowledge on the homepage. Perfect for fixing profile errors!',
            side: "left"
          }
        },
        // --- STEP 6: DISCUSSIONS ---
        {
          element: '#sidebar-discussions',
          popover: {
            title: 'Community Discussions',
            description: 'Moderate the forum posts. You can delete inappropriate content or sticky important announcements here.',
            side: "right"
          }
        },
        // --- STEP 7: LIVE ROOMS ---
        {
          element: '#sidebar-live-rooms',
          popover: {
            title: 'Arena Management',
            description: 'Monitor active voice and video rooms. Ensure the community space remains safe and productive.',
            side: "right"
          }
        },
        // --- STEP 8: QUIZ BASE ---
        {
          element: '#sidebar-quiz',
          popover: {
            title: 'Technical Quiz Base',
            description: 'Manage the pool of coding questions. Click next to see the question bank.',
            side: "right",
            onNextClick: () => {
              navigate('/admin/quiz');
              setTimeout(() => {
                driverObj.moveNext();
              }, 500);
            }
          }
        },
        // --- STEP 9: ADD QUIZ QUESTION ---
        {
          element: '#admin-add-quiz-btn',
          popover: {
            title: 'Expand the Knowledge Base',
            description: 'Add new questions here. You can categorize them by domain (AI, Web, etc.) and difficulty.',
            side: "bottom"
          }
        },
        // --- STEP 10: DOMAINS ---
        {
          element: '#sidebar-domains',
          popover: {
            title: 'Domain Central',
            description: 'Manage specialized sectors (AI, Web, Cyber). Review member applications and update domain descriptions.',
            side: "right"
          }
        },
        // --- STEP 11: EVENTS ---
        {
          element: '#sidebar-events',
          popover: {
            title: 'Mission Control: Events',
            description: 'The heart of club activities. Create new workshops, hackathons, and seminars. Click next to see how to launch new missions.',
            side: "right",
            onNextClick: () => {
              navigate('/admin/events');
              setTimeout(() => {
                driverObj.moveNext();
              }, 500);
            }
          }
        },
        // --- STEP 12: ADD EVENT ---
        {
          element: '#admin-add-event-btn',
          popover: {
            title: 'Launch a New Event',
            description: 'Use this button to create a new event. You can set the banner, rules, date, and even auto-generate UPI payment QR codes!',
            side: "bottom"
          }
        },
        // --- STEP 13: BANNERS ---
        {
          element: '#sidebar-banners',
          popover: {
            title: 'Promotional Spotlight',
            description: 'Control what users see first. Upload banners for mega-events or important announcements here.',
            side: "right"
          }
        },
        // --- STEP 14: LIVE TESTS ---
        {
          element: '#sidebar-live-tests',
          popover: {
            title: 'Autonomous Testing',
            description: 'Manage official test sessions. Click next to see the proctoring dashboard.',
            side: "right",
            onNextClick: () => {
              navigate('/admin/test-sessions');
              setTimeout(() => {
                driverObj.moveNext();
              }, 500);
            }
          }
        },
        // --- STEP 15: START TEST ---
        {
          element: '#admin-add-test-btn',
          popover: {
            title: 'Launch Official Exam',
            description: 'Generate unique credentials (ID/Pass) for secure, proctored examinations here.',
            side: "bottom"
          }
        },
        // --- STEP 16: CLUB CENTRAL ---
        {
          element: '#sidebar-club-central',
          popover: {
            title: 'System Settings',
            description: 'Configure club-wide parameters, social links, and core platform behavior.',
            side: "right"
          }
        },
        // --- STEP 15: CONCLUSION ---
        {
          popover: {
            title: 'Master Administrator!',
            description: 'You have now seen every corner of the control center. Use this power to build an elite coding community. Good luck!',
            side: "center"
          }
        }
      ],
      onDestroyStarted: () => {
        if (onEnd) onEnd();
        driverObj.destroy();
      }
    });

    if (onStart) onStart();
    driverObj.drive();
  };

  return { startHomeTour, startCodingHubTour, startAdminTour };
};
