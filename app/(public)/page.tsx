import { supabase } from '@/lib/supabase';
import HeroSection from '@/components/home/HeroSection';
import RequestBrowser from '@/components/home/RequestBrowser';
import HospitalDirectory from '@/components/home/HospitalDirectory';
import DonorGuide from '@/components/home/DonorGuide';
import { bangkokToday, type BloodRequest, type Hospital } from '@/types/database';

export const dynamic = 'force-dynamic';

async function getLandingData() {
  const [requestsRes, hospitalsRes] = await Promise.all([
    supabase
      .from('blood_requests')
      .select(`
        request_id,
        hospital_id,
        blood_type,
        rh_factor,
        units_needed,
        urgency_level,
        purpose,
        target_date,
        status,
        created_at,
        hospitals (
          name,
          province
        ),
        donation_records (
          record_id,
          volume_ml,
          status
        )
      `)
      .eq('status', 'OPEN')
      .gte('target_date', bangkokToday())
      .order('urgency_level', { ascending: true}) // Sort By Urgency level first ( Critical -> H -> N)
      .order('created_at', { ascending: false }), // Then sort by lastest case

    supabase
      .from('hospitals')
      .select('*')
      .order('name', { ascending: true })
  ]);

  if (requestsRes.error) {
    console.error('Error fetching blood requests:', requestsRes.error);
  }

  if (hospitalsRes.error) {
    console.error('Error fetching hospitals:', hospitalsRes.error);
  }

  return {
    // use (as unknown as BloodRequest[]) to prevent TypeScript from Join many tables
    requests: ((requestsRes.data as unknown) as BloodRequest[]) || [],
    hospitals: (hospitalsRes.data as Hospital[]) || []
  };
}

export default async function LandingPage() {
  const { requests, hospitals } = await getLandingData();

  return (
    <>
      <HeroSection />
      <RequestBrowser requests={requests} />
      <HospitalDirectory hospitals={hospitals} />
      <DonorGuide />
    </>
  );
}
