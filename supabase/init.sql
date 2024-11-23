-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Contact submissions table
create table if not exists contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Counties reference table
create table if not exists counties (
  id text primary key,
  name text not null,
  region text not null
);

-- Bills table
create table if not exists bills (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  type text not null check (type in ('national', 'county')),
  county_id text references counties(id),
  status text not null check (status in ('draft', 'review', 'passed', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bill votes table
create table if not exists bill_votes (
  id uuid default uuid_generate_v4() primary key,
  bill_id uuid references bills(id) not null,
  user_id uuid not null,
  vote text not null check (vote in ('yes', 'no', 'undecided')),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert some sample counties
insert into counties (id, name, region) values
  ('nairobi', 'Nairobi', 'Nairobi'),
  ('mombasa', 'Mombasa', 'Coast'),
  ('kisumu', 'Kisumu', 'Nyanza'),
  ('nakuru', 'Nakuru', 'Rift Valley'),
  ('uasin-gishu', 'Uasin Gishu', 'Rift Valley')
on conflict (id) do nothing;

-- Insert sample national bills
insert into bills (title, description, type, status) values
  ('National Healthcare Reform Bill', 'A comprehensive reform of the national healthcare system', 'national', 'review'),
  ('Education Funding Act', 'Increase funding for public education institutions', 'national', 'draft'),
  ('Infrastructure Development Bill', 'National infrastructure development and maintenance', 'national', 'review')
on conflict do nothing;

-- Insert sample county bills
insert into bills (title, description, type, county_id, status) values
  ('Nairobi Public Transport Bill', 'Restructuring public transport in Nairobi County', 'county', 'nairobi', 'draft'),
  ('Mombasa Port Development Act', 'Expansion and modernization of Mombasa port facilities', 'county', 'mombasa', 'review'),
  ('Kisumu Lake Conservation Bill', 'Protection and conservation of Lake Victoria shores', 'county', 'kisumu', 'draft')
on conflict do nothing;

-- Create or replace function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for bills table
create trigger update_bills_updated_at
  before update on bills
  for each row
  execute function update_updated_at_column();

-- Create indexes for better query performance
create index if not exists idx_bills_type on bills(type);
create index if not exists idx_bills_county_id on bills(county_id);
create index if not exists idx_bill_votes_bill_id on bill_votes(bill_id);
create index if not exists idx_bill_votes_user_id on bill_votes(user_id);
