import { useState, useEffect, FormEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import styles from './create.module.scss';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { UserContext } from '../../contexts/UserContext';
import { DepartmentContext } from '../../contexts/DepartmentContext';
import { toast } from 'react-toastify';
import { Header } from '../../components/Header';
import Head from 'next/head';
import MainLayout from '../../components/MainLayout';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO'>('Employee');
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedInUserRole, setLoggedInUserRole] = useState<'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO' | null>(null);
  const router = useRouter();
  const { users, getUsers, getUser } = useContext(UserContext); // Get the logged-in user data
  const { departments, fetchDepartments } = useContext(DepartmentContext);
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    fetchDepartments();
    getUsers(); // Fetch departments and users for selection if necessary
  }, [fetchDepartments, getUsers]);

  useEffect(() => {
    async function fetchLoggedInUserData() {
      const loggedInUser = await getUser();
      if (!loggedInUser) {
        console.error('Logged-in user not found');
        return; // Return if there is no logged-in user
      }
      console.log('LoggedInUser:', loggedInUser); // Log the logged-in user data
      setLoggedInUserRole(loggedInUser.role); // Set the logged-in user role
      if (loggedInUser.role === 'Manager' || loggedInUser.role === 'Director') {
        setDepartmentId(loggedInUser.departmentId || null); // If Manager or Director, set department automatically
      }
    }
    fetchLoggedInUserData();
  }, [getUser]);

  // Function to handle form submission
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (name === '' || email === '' || password === '') {
      toast.warning('All fields are required');
      return;
    }
    if (password !== passwordConfirm) {
      toast.warning('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      if (photo) formData.append('file', photo); // Add the photo if present
      if (departmentId) formData.append('departmentId', departmentId.toString());

      await api.post('/user', formData); // Send the user to the API
      toast.success('User created successfully!');
      router.push('/userslist');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  // Conditionally render department selection based on the logged-in user
  function renderDepartmentSelect() {
    // Display department selection only if the logged-in user is Accounting or CFO
    if (loggedInUserRole === 'Accounting' || loggedInUserRole === 'CFO') {
      return (
        <Select
          value={departmentId || ''}
          onChange={(e) => setDepartmentId(Number(e.target.value) || null)} // Ensure the value is a number
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </Select>
      );
    }
    return null; // Department will be set automatically if the user is Manager or Director
  }

  return (
    <MainLayout>
    <>
      <Head>
        <title>Workflows - User Create</title>
      </Head>
      <Header />
    <div className={styles.createUserContainer}>
      <h1 className={styles.title}>Create User</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <Input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password Confirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />

        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO')}
        >
          <option value="">Select Role</option>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Director">Director</option>
          <option value="Accounting">Accounting</option>
          <option value="CFO">CFO</option>
        </Select>

        {/* Conditionally display department selection based on the logged-in user */}
        {renderDepartmentSelect()}

        <Input
          type="file"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        />

        <Button type="submit" loading={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </div>
    </>
    </MainLayout>
  );
};

// Protect the page for authenticated users
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {},
  };
});

export default CreateUser;
