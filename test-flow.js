const baseURL = 'http://localhost:5000/api';
let customerToken = '';
let providerToken = '';
let customerId = '';
let providerId = '';
let serviceId = '';
let bookingId = '';

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    throw new Error(`Invalid JSON: ${text}`);
  }
  if (!res.ok) throw { response: { data } };
  return data;
}

async function runTest() {
  try {
    console.log('1. Register Customer');
    const registerData = await fetchJSON(`${baseURL}/auth/register/user`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Customer',
        email: `testcustomer.${Date.now()}@example.com`,
        password: 'password123',
        phone: '9998887776',
        address: '123 Testing Lane'
      })
    });
    customerToken = registerData.token;
    customerId = registerData.id;
    console.log('Customer registered successfully');

    console.log('\n2. Get Services');
    const services = await fetchJSON(`${baseURL}/services`);
    if (services.length === 0) throw new Error('No services found');
    serviceId = services[0].id;
    console.log(`Found service: ${services[0].name}`);

    console.log('\n3. Get Providers for Service');
    const providersData = await fetchJSON(`${baseURL}/public/providers?serviceId=${serviceId}`);
    console.log('Providers data:', JSON.stringify(providersData).substring(0, 200));
    const providers = providersData.providers || providersData;
    if (!providers || providers.length === 0) throw new Error('No providers found');
    const ramesh = providers.find(p => p.name === 'Ramesh Sharma') || providers[0];
    providerId = ramesh._id || ramesh.id;
    console.log(`Found provider: ${ramesh.name}`);

    console.log('\n4. Book Service');
    const bookingData = await fetchJSON(`${baseURL}/bookings`, {
      method: 'POST',
      body: JSON.stringify({
        providerId: providerId,
        serviceId: serviceId,
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        slotStart: '10:00',
        slotEnd: '11:00',
        address: { line1: '123 Testing Lane', city: 'Test City', state: 'TS', pincode: '123456' },
        pricing: { baseAmount: 500, taxes: 90, total: 590 },
        notes: 'Test booking'
      }),
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('Booking response:', bookingData);
    bookingId = bookingData.booking?.id || bookingData.booking?._id || bookingData.id || bookingData._id;
    console.log(`Booking created: ${bookingId}`);

    console.log('\n5. Provider Login');
    const emailMap = {
      'Ramesh Sharma': 'ramesh@example.com',
      'Amit Verma': 'amit@example.com',
      'Suresh Kumar': 'suresh@example.com',
      'Rajesh Singh': 'rajesh@example.com',
      'Priya Patel': 'priya@example.com',
      'Vikram Singh': 'vikram@example.com',
      'Sanjay Dutt': 'sanjay@example.com',
      'Sunil Gavaskar': 'sunil@example.com',
      'Manoj Bajpayee': 'manoj@example.com'
    };
    const providerEmail = emailMap[ramesh.name] || 'ramesh@example.com';
    const loginData = await fetchJSON(`${baseURL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: providerEmail,
        password: 'password123',
        role: 'provider'
      })
    });
    providerToken = loginData.token;
    console.log('Provider logged in');

    console.log('\n6. Get Provider Dashboard');
    const dashboardData = await fetchJSON(`${baseURL}/dashboards/provider/dashboard`, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    console.log('Provider Dashboard fetched successfully');
    
    // Accept booking
    console.log('\n7. Provider Accept Booking');
    const acceptData = await fetchJSON(`${baseURL}/provider/bookings/${bookingId}/accept`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    console.log('Booking accepted');
    
    // Start booking
    console.log('\n8. Provider Start Booking');
    const otp = bookingData.booking?.otp || bookingData.otp;
    console.log('Using OTP:', otp);
    const startData = await fetchJSON(`${baseURL}/provider/bookings/${bookingId}/start`, {
      method: 'PATCH',
      body: JSON.stringify({ otp }),
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    console.log('Booking started');

    // Complete booking
    console.log('\n9. Provider Complete Booking');
    const completeData = await fetchJSON(`${baseURL}/provider/bookings/${bookingId}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    console.log('Booking completed');
    
    console.log('\nWorkflow completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

runTest();
