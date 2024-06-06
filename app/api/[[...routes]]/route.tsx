/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import RaffleAbi from '../../../abis/Raffle.json'
import { http, createPublicClient } from "viem";
import { baseSepolia } from 'viem/chains'
import { ethers } from 'ethers';
import { formatTimeLeft, hasRaffleEnded } from '@/utils/utils';
import { Box } from '../ui.ts'
import axiosInstance from '@/utils/axios'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  imageOptions: {
    fonts: [
      {
        name: 'Pixelify Sans',
        source: 'google',
      },
    ]
  }
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_RPC_PROVIDER_SEPOLIA),
});

const getTimeLeftColor = (timeStarted: number, duration: number) => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const endTime = timeStarted + duration;
  const timeLeft = endTime - now;

  const minutes = Math.floor(timeLeft / 60);
  const hours = Math.floor(minutes / 60);

  if (hours < 1) return 'red';
  if (hours < 12) return '#FFBF00';
  return 'black';
}

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/raffle/:id', async(c) => {
  const id = c.req.param('id');
  const { deriveState } = c

  const {
    isActive,
    title,
    ticketPrice,
    maxTotalTickets,
    totalTickets,
    timeStarted,
    maxEntries,
    duration,
    numWinners,
    allowDuplicates
  } = await axiosInstance.post('/getRaffle', {
    id
  }).then((response) => {
      return response.data;
  }).catch((err) => {
      return err;
  });

  const ticketPriceFormatted = Number(ticketPrice) > 0 ? ticketPrice : 0;

  const totalTicketsAvailable = maxTotalTickets > 0  ? maxTotalTickets - totalTickets : 'Unlimited';

  const raffleHasEnded = hasRaffleEnded(timeStarted, duration);

  const timeLeftColor = getTimeLeftColor(timeStarted, duration);

  return c.res({
    image: (
      <div
        style={{
          border: '20px dashed black',
          background: 'white',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          padding: '50px',
          fontFamily: 'Pixelfy Sans',
        }}
      >
        <Box display='flex' flexWrap='wrap' flexDirection='row' alignItems='center'>
          <img src='/logo.png' style={{ height: '100px', marginRight: '15px'}}/>
          <p style={{fontSize: '48px', marginBottom: '10px', fontWeight:'bold'}}>
              {title}
          </p>
        </Box>
        <Box display='flex' flexWrap='wrap' flexDirection='row' alignItems='center'>
          <p style={{fontSize: '38px', fontWeight: 'bold'}}>
              Number of Winners - 
          </p>
          <p style={{fontSize: '38px', margin: 0, marginLeft: '10px'}}>
            {numWinners} 
          </p>
          <p style={{fontSize: '38px', margin: 0, marginLeft: '10px'}}>
            {allowDuplicates ? '(Allows Duplicates)' : ''}
          </p>
        </Box>
        <Box display='flex' flexWrap='wrap' flexDirection='row' alignItems='center'>
          <p style={{fontSize: '38px', fontFamily: 'Pixelfy Sans', fontWeight: 'bold'}}> 
              Ticket Price -
          </p>
          <p style={{fontSize: '38px', margin: 0, marginLeft: '10px'}}>
            {ticketPriceFormatted} ETH
          </p>
        </Box>
        <Box display='flex' flexWrap='wrap' flexDirection='row' alignItems='center'>
          <p style={{fontSize: '38px', fontFamily: 'Pixelfy Sans', fontWeight: 'bold'}}>
              Number of Tickets Left -
          </p>
          <p style={{fontSize: '38px', margin: 0, marginLeft: '10px'}}>
            {totalTicketsAvailable}
          </p>
        </Box>
        {maxEntries > 0 && 
          <Box display='flex' flexWrap='wrap' flexDirection='row' alignItems='center'>
            <p style={{fontSize: '38px', fontFamily: 'Pixelfy Sans', fontWeight: 'bold'}}>
                Ticket Limit Per Participant -
            </p>
            <p style={{fontSize: '38px', margin: 0, marginLeft: '10px'}}>
              {maxEntries}
            </p>
          </Box>
        }
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '30px'
          }}
        >
            {!raffleHasEnded ? <p style={{fontSize: '36px', padding: '8px', background: timeLeftColor, color: 'white'}}>{formatTimeLeft(timeStarted, duration)}</p> : <></>}
            <Box>
              {!isActive && <p style={{fontSize: '36px', marginLeft: 'auto',  padding: '8px', background: 'red', color: 'white'}}>Ended</p>}
              {raffleHasEnded && isActive && <p style={{fontSize: '36px', marginLeft: 'auto',  padding: '8px', background: '#FFBF00', color: 'white'}}>Drawing</p>}
              {!raffleHasEnded && isActive && <p style={{fontSize: '36px', marginLeft: 'auto',  padding: '8px', background: '#00A36C', color: 'white'}}>Active</p>}
            </Box>
        </div>  
      </div>
    ),
    intents: [
      <TextInput placeholder='How many tickets would you like?'/>,
      <Button.Transaction target={`/purchaseTickets/raffle/${id}/${ticketPriceFormatted}`}>Purchase</Button.Transaction>,
      <Button.Redirect location={`http://localhost:3000/raffle/${id}`}>View Details</Button.Redirect>,
      <Button.Redirect location='http://localhost:3000/'>Create Raffle</Button.Redirect>
    ],
  })
})

app.transaction('/purchaseTickets/raffle/:id/:ticketPrice', async (c) => {
  const { inputText } = c;

  if (inputText === '' || !Number.isInteger(Number(inputText)) || Number(inputText) <= 0) return c.error({message: 'Must provide a valid number > 0'});

  
  const ticketPrice = c.req.param('ticketPrice')
  const raffleID = c.req.param('id');

  const totalPrice = (Number(ticketPrice) * Number(inputText)).toString();
  const ethToWei = ethers.parseUnits(totalPrice);

  return c.contract({
    abi: RaffleAbi,
    chainId: `eip155:${baseSepolia.id}`,
    functionName: 'purchaseTicket',
    args: [raffleID, inputText],
    to: process.env.CONTRACT_ADDRESS as `0x${string}`,
    value: ethToWei
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
