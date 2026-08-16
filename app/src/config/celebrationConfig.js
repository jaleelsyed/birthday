/**
 * ────────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT
 * ────────────────────────────────────────────────────────────────
 *  Everything the celebration says, shows, and plays lives here.
 *  Change the name, the wishes, the colours, the music — nothing
 *  else needs touching.
 */

export const celebrationConfig = {
  // Who is this for?
  // Use {name} inside any copy below and it gets replaced with this.
  name: 'Farhat',

  // Optional line under the final HAPPY BIRTHDAY (leave '' to hide)
  signature: 'With all my love',

  /* Background music.
   * Drop your own file at: public/audio/birthday-celebration.mp3
   * If the file is missing, an elegant synthesized score plays instead,
   * so the experience always has sound out of the box. */
  music: {
    src: '/audio/birthday-celebration.mp3',
    startMuted: false,
  },

  /* Copy for each ceremony. Keep it warm and personal.
   *
   * `button`        — the gold call to action: the thing you DO on this screen.
   * `continueLabel` — the quiet link shown after the moment has played out.
   *                   Keep these neutral; if one names the next screen's
   *                   action, that action appears to be asked for twice. */
  stages: {
    intro: {
      eyebrow: 'A celebration, just for {name}',
      lead: 'Someone special deserves a special celebration…',
      button: "Let's Start",
      buttonEmoji: '✨',
    },
    room: {
      button: 'Light Up the Room',
      buttonEmoji: '💡',
      duringTitle: 'Let’s light up the room…',
      revealTitle: 'Because today is your day.',
      continueLabel: 'Continue',
    },
    balloons: {
      title: 'It’s time to celebrate!',
      titleEmoji: '🎈',
      button: 'Release the Balloons',
      revealTitle: 'Let the celebration begin!',
      revealEmoji: '🎉',
      continueLabel: 'Continue',
    },
    gift: {
      title: 'Something arrived for you',
      titleEmoji: '🎁',
      button: 'Untie the Ribbon',
      revealTitle: 'Everything good, wrapped up for you',
      continueLabel: 'Continue',
    },
    cake: {
      title: 'And what’s a birthday without a cake?',
      titleEmoji: '🎂',
      button: 'Bring Out the Cake',
      revealTitle: 'Made especially for you',
      revealEmoji: '❤️',
      continueLabel: 'Continue',
    },
    wish: {
      title: 'Make a wish…',
      titleEmoji: '✨',
      button: 'Make a Wish',
      closing: 'May every beautiful wish find its way to you. ❤️',
      continueLabel: 'Continue',
    },
    letter: {
      title: 'And a few words, just for you',
      button: 'Open the Letter',
      // Each line lands on its own, at reading pace. Make these yours.
      body: [
        'I hope today feels as good as you make everything else feel.',
        'Thank you for the laughing, the patience, the small kindnesses nobody else notices.',
        'Whatever this year asks of you, I hope it gives back twice as much.',
      ],
      continueLabel: 'Continue',
    },
    constellation: {
      title: 'Somewhere up there…',
      lead: 'Every year a new star is lit. Tonight, one of them is yours.',
      button: 'Find Your Star',
      revealTitle: 'The {name} Constellation',
      caption: 'Named tonight, and shining for you.',
      continueLabel: 'Continue',
    },
    sky: {
      prelude: 'One last thing…',
      button: 'Light Up the Sky',
      buttonEmoji: '✨',
      finaleTitle: 'Happy Birthday',
      finaleEmoji: '❤️',
      finaleLine: 'Today, tomorrow, and every day — you deserve to be celebrated.',
    },
  },

  // The wishes that float up from the cake, in order.
  // Add or remove freely — the timing adapts to however many there are.
  wishes: [
    'Happiness',
    'Love',
    'Good Health',
    'Success',
    'Beautiful Memories',
    'Endless Smiles',
    'Peace of Mind',
    'Dreams That Come True',
    'Everything Your Heart Desires',
  ],

  // Balloon colours (used for the SVG gradients).
  balloonColors: [
    ['#F3D9DD', '#D99AA6'], // blush
    ['#F7E9C9', '#C9A35B'], // champagne
    ['#FFFFFF', '#EFE4D3'], // ivory white
    ['#E9CF95', '#C9A35B'], // gold
    ['#EAD7F0', '#C9A9E0'], // soft lilac pastel
    ['#F6D7C4', '#E2A98C'], // peach
  ],

  // Petals — drifting in the air, and thrown when the candles go out.
  petalColors: ['#F3D9DD', '#D99AA6', '#E9CF95', '#FBE7B5', '#EAD7F0', '#F6D7C4'],

  // The small crackers that pop around the cake at the blow-out.
  crackerColors: ['#E9CF95', '#FBE7B5', '#F3D9DD', '#FFFFFF'],

  // Firework burst colours for the finale.
  fireworkColors: ['#E9CF95', '#F3D9DD', '#FFFFFF', '#C9A35B', '#D99AA6', '#FBE7B5'],
};

export default celebrationConfig;
