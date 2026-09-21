const fs = require('fs');
const file = 'coursespro/src/app/(mentor)/mentor/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// We need to fetch the mentor profile and check payouts_enabled
const stateAdd = `
  const { data: profile } = useQuery({
    queryKey: ['mentor-profile-dashboard'],
    queryFn: async () => {
      const res = await coursesApi.get('/api/mentor/profile');
      return res.data;
    }
  });
  
  const payoutsEnabled = profile?.payouts_enabled ?? true;
`;

code = code.replace(/return \(\s*<>/, stateAdd + '\n  return (\n    <>');

// Hide the earnings widget conditionally
code = code.replace(/<div className="bg-white rounded-\[1\.5rem\] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group">/g, 
  `{payoutsEnabled && (<div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between aspect-square group">`);

code = code.replace(/<\/h2>\n          <\/div>\n        <\/div>/, 
  `</h2>\n          </div>\n        </div>)}`);

fs.writeFileSync(file, code);
