import { useState } from 'react';
import { z } from 'zod';
import { SnowForm, registerFormUIStyles, setOnErrorBehavior } from '../../src';
import { ConfigPanel, SubmittedDataDisplay, type DemoConfig } from './components';

// Register default styles for the demo
registerFormUIStyles({
  form: 'space-y-4',
  formItem: 'grid gap-2',
  formLabel: 'text-sm font-medium text-gray-700',
  formLabelError: 'text-red-500',
  formDescription: 'text-sm text-gray-500',
  formMessage: 'text-sm text-red-500',
});

// Scroll to first error on validation failure
setOnErrorBehavior((formRef, errors) => {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = formRef?.querySelector(`[name="${firstErrorField}"]`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// Complete schema showcasing all field types
const schema = z.object({
  // Text inputs
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // Number
  age: z.number().min(18, 'Must be at least 18').max(120, 'Invalid age'),
  // Textarea
  bio: z.string().optional(),
  // Select (enum)
  role: z.enum(['admin', 'user', 'guest']),
  // Radio
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  // Checkbox
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
  // Date/Time inputs
  birthDate: z.string().date().optional(),
  appointmentTime: z.string().optional(),
  eventDateTime: z.string().optional(),
  // Contact inputs
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  // Other inputs
  favoriteColor: z.string().optional(),
  profilePicture: z.string().optional(),
  secretCode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// Simulated async data (like from an API)
const fetchUserData = async (): Promise<Partial<FormData>> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'securepassword123',
    age: 28,
    bio: 'Software developer passionate about open source.',
    role: 'admin',
    gender: 'female',
    birthDate: '1996-03-15',
    appointmentTime: '14:30',
    phone: '+1 555 987 6543',
    website: 'https://janesmith.dev',
    favoriteColor: '#8b5cf6',
  };
};

export function App() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [asyncData, setAsyncData] = useState<Partial<FormData> | null>(null);
  const [isLoadingAsync, setIsLoadingAsync] = useState(false);
  const [config, setConfig] = useState<DemoConfig>({
    simulateEndpointError: false,
    simulateSlowSubmission: false,
    showDebugMode: true,
  });

  const handleSubmit = async (data: FormData) => {
    if (config.simulateSlowSubmission) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (config.simulateEndpointError) {
      const error = new Error('API_VALIDATION_ERROR');
      (error as Error & { fieldErrors: Record<string, string> }).fieldErrors = {
        firstName: 'This first name is already taken',
        email: 'This email is already registered',
      };
      throw error;
    }

    setSubmittedData(data);
    return data;
  };

  const handleSubmitError = (setManualErrors: (errors: Record<string, string> | null) => void, error: unknown) => {
    if (error instanceof Error && 'fieldErrors' in error) {
      const fieldErrors = (error as Error & { fieldErrors: Record<string, string> }).fieldErrors;
      setManualErrors(fieldErrors);
    }
  };

  const toggleConfig = (key: keyof DemoConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFillAsync = async () => {
    setIsLoadingAsync(true);
    const data = await fetchUserData();
    setAsyncData(data);
    setFormKey(prev => prev + 1);
    setIsLoadingAsync(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">@snowpact/react-rhf-zod-form</h1>
          <p className="text-gray-600 mb-8">All available field types demo</p>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <SnowForm
              key={formKey}
              debug={config.showDebugMode}
              schema={schema}
              defaultValues={asyncData ?? { firstName: 'test' }}
              onSubmit={handleSubmit}
              onSubmitError={handleSubmitError}
              onSuccess={() => alert('Form submitted successfully!')}
              overrides={{
                firstName: { label: 'First Name', placeholder: 'John' },
                lastName: { label: 'Last Name', placeholder: 'Doe' },
                email: {
                  label: 'Email Address',
                  type: 'email',
                  placeholder: 'john@example.com',
                  description: 'We will never share your email',
                },
                password: {
                  label: 'Password',
                  type: 'password',
                  placeholder: '••••••••',
                  description: 'Must be at least 8 characters',
                },
                age: { label: 'Age', description: 'Must be 18 or older' },
                bio: {
                  label: 'Biography',
                  type: 'textarea',
                  placeholder: 'Tell us about yourself...',
                  description: 'Optional',
                },
                role: {
                  label: 'Role',
                  type: 'select',
                  options: [
                    { value: 'admin', label: 'Administrator' },
                    { value: 'user', label: 'Regular User' },
                    { value: 'guest', label: 'Guest' },
                  ],
                },
                gender: {
                  label: 'Gender',
                  type: 'radio',
                  render: ({ value, onChange }) => (
                    <div className="flex flex-col gap-2">
                      {[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                        { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={option.value}
                            checked={value === option.value}
                            onChange={e => onChange(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ),
                },
                acceptTerms: {
                  label: 'I accept the terms and conditions',
                  type: 'checkbox',
                },
                birthDate: { label: 'Birth Date', type: 'date' },
                appointmentTime: {
                  label: 'Preferred Time',
                  type: 'time',
                  description: 'Select your preferred appointment time',
                },
                eventDateTime: {
                  label: 'Event Date & Time',
                  type: 'datetime-local',
                },
                phone: {
                  label: 'Phone Number',
                  type: 'tel',
                  placeholder: '+1 (555) 123-4567',
                },
                website: {
                  label: 'Website',
                  type: 'url',
                  placeholder: 'https://example.com',
                  emptyAsUndefined: true,
                },
                favoriteColor: {
                  label: 'Favorite Color',
                  description: 'Pick your favorite color',
                  render: ({ value, onChange }) => (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={value || '#3b82f6'}
                        onChange={e => onChange(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-sm text-gray-600 font-mono">{value || '#3b82f6'}</span>
                    </div>
                  ),
                },
                profilePicture: {
                  label: 'Profile Picture',
                  type: 'file',
                  description: 'Upload a profile picture (JPG, PNG)',
                },
                secretCode: { label: 'Secret Code', type: 'hidden' },
              }}
            />
          </div>

          <SubmittedDataDisplay data={submittedData} />
        </div>
      </div>

      {/* Config Panel - Right Side Fixed */}
      <div className="w-72 flex-shrink-0 h-screen sticky top-0">
        <ConfigPanel
          config={config}
          onToggle={toggleConfig}
          onFillAsync={handleFillAsync}
          isLoadingAsync={isLoadingAsync}
        />
      </div>
    </div>
  );
}
