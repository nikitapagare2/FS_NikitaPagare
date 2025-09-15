'use server';

import {Client, GeocodeCommand} from '@googlemaps/google-maps-services-js';

const client = new Client({});

export async function getCoordinates(address: string) {
  const command = new GeocodeCommand({
    params: {
      address,
      key: process.env.GOOGLE_MAPS_API_KEY!,
    },
  });

  try {
    const response = await client.send(command);
    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }
    throw new Error('No results found for the address.');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to get coordinates for the address.');
  }
}
