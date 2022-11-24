import { Card, GEMS, ObtainData, SwapData, UpgradeData } from "./types";

const actionCards: Card[] = [
  {
    id: 0,
    type: 'obtain',
    data: {
      [GEMS.yellow]: 2
    } as ObtainData
  },
  {
    id: 1,
    type: 'upgrade',
    data: {
      value: 2
    } as UpgradeData
  },
  {
    id: 2,
    type: 'obtain',
    data: {
      [GEMS.yellow]: 3,
    } as ObtainData
  },
  {
    id: 3,
    type: 'obtain',
    data: {
      [GEMS.yellow]: 2,
      [GEMS.green]: 1,
    } as ObtainData
  },
  {
    id: 4,
    type: 'obtain',
    data: {
      [GEMS.green]: 2,
    } as ObtainData
  },
  {
    id: 5,
    type: 'obtain',
    data: {
      [GEMS.yellow]: 4,
    } as ObtainData
  },
  {
    id: 6,
    type: 'swap',
    data: {
      from: {
        [GEMS.green]: 2
      },
      to: {
        [GEMS.blue]: 2
      }
    } as SwapData
  },
  {
    id: 7,
    type: 'swap',
    data: {
      from: {
        [GEMS.yellow]: 5
      },
      to: {
        [GEMS.blue]: 3
      }
    } as SwapData
  },
  {
    id: 8,
    type: 'swap',
    data: {
      from: {
        [GEMS.blue]: 2
      },
      to: {
        [GEMS.yellow]: 2,
        [GEMS.green]: 3
      }
    } as SwapData
  },
  {
    id: 9,
    type: 'swap',
    data: {
      from: {
        [GEMS.blue]: 2
      },
      to: {
        [GEMS.green]: 2,
        [GEMS.magenta]: 1
      }
    } as SwapData
  },
  
  {
    id: 10,
    type: 'swap',
    data: {
      from: {
        [GEMS.blue]: 1
      },
      to: {
        [GEMS.green]: 2,
        [GEMS.yellow]: 1
      }
    } as SwapData
  },
  {
    id: 11,
    type: 'swap',
    data: {
      from: {
        [GEMS.yellow]: 2
      },
      to: {
        [GEMS.green]: 2
      }
    } as SwapData
  },
  {
    id: 12,
    type: 'swap',
    data: {
      from: {
        [GEMS.green]: 1,
        [GEMS.yellow]: 1
      },
      to: {
        [GEMS.magenta]: 1
      }
    } as SwapData
  },
  {
    id: 13,
    type: 'swap',
    data: {
      from: {
        [GEMS.green]: 2
      },
      to: {
        [GEMS.yellow]: 2,
        [GEMS.magenta]: 1
      }
    } as SwapData
  },
  {
    id: 14,
    type: 'swap',
    data: {
      from: {
        [GEMS.yellow]: 3
      },
      to: {
        [GEMS.magenta]: 1
      }
    } as SwapData
  },
  
  {
    id: 15,
    type: 'obtain',
    data: {
      [GEMS.blue]: 1
    } as ObtainData
  },
  {
    id: 16,
    type: 'swap',
    data: {
      from: {
        [GEMS.yellow]: 3
      },
      to: {
        [GEMS.green]: 1,
        [GEMS.blue]: 1
      }
    } as SwapData
  },
  {
    id: 17,
    type: 'swap',
    data: {
      from: {
        [GEMS.magenta]: 2
      },
      to: {
        [GEMS.blue]: 2,
        [GEMS.green]: 3
      }
    } as SwapData
  },
  {
    id: 18,
    type: 'obtain',
    data: {
      [GEMS.blue]: 1,
      [GEMS.yellow]: 1
    } as ObtainData
  },
  {
    id: 19,
    type: 'swap',
    data: {
      from: {
        [GEMS.yellow]: 4
      },
      to: {
        [GEMS.blue]: 1,
        [GEMS.magenta]: 1
      }
    } as SwapData
  },
  
  {
    id: 20,
    type: 'swap',
    data: {
      from: {
        [GEMS.green]: 3
      },
      to: {
        [GEMS.blue]: 1,
        [GEMS.magenta]: 1,
        [GEMS.yellow]: 1
      }
    } as SwapData
  },
  {
    id: 21,
    type: 'swap',
    data: {
      from: {
        [GEMS.blue]: 2
      },
      to: {
        [GEMS.green]: 1,
        [GEMS.magenta]: 1,
        [GEMS.yellow]: 2
      }
    } as SwapData
  },
  {
    id: 22,
    type: 'swap',
    data: {
      from: {
        [GEMS.magenta]: 1
      },
      to: {
        [GEMS.blue]: 1,
        [GEMS.yellow]: 3
      }
    } as SwapData
  },
  {
    id: 23,
    type: 'swap',
    data: {
      from: {
        [GEMS.yellow]: 3
      },
      to: {
        [GEMS.green]: 3
      }
    } as SwapData
  },
  {
    id: 24,
    type: 'swap',
    data: {
      from: {
        [GEMS.green]: 3
      },
      to: {
        [GEMS.magenta]: 2
      }
    } as SwapData
  },
  
  
]

export default actionCards;
