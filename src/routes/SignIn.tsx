import { Button, Checkbox, Divider, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { UserCircleIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Navigate, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useAuth } from '../lib/useAuth'

const validationSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
})

export function SignIn() {
  const navigate = useNavigate()
  const { signIn, status } = useAuth()
  const [passwordVisible, setPasswordVisible] = useState(false)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`
      const toastId = toast.loading('Cargando...')

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const text = await res.text()

      if (text !== 'Credenciales inválidas') {
        console.log(text)
        signIn(text)
        navigate('/')
        toast.success('¡Bienvenido!', { id: toastId })
      } else {
        toast.error('Error al iniciar sesión', { id: toastId })
      }
    },
    validationSchema,
  })

  if (status === 'AUTHENTICATED') {
    return <Navigate to="/" />
  }

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <form
        className="mx-auto flex w-full max-w-md flex-col gap-4"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
          <UserCircleIcon className="size-8" />
          <div className="text-xl font-bold">Ingreso</div>
        </div>

        <Divider />

        <TextField
          label="Nombre de usuario"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          variant="filled"
        />

        <TextField
          label="Contraseña"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type={passwordVisible ? 'text' : 'password'}
          value={formik.values.password}
          variant="filled"
        />

        <label className="flex items-center gap-2">
          <Checkbox
            checked={passwordVisible}
            onChange={(event) => setPasswordVisible(event.target.checked)}
          />

          <span>Mostrar contraseña</span>
        </label>

        <div className="flex justify-end">
          <Button loading={formik.isSubmitting} type="submit">
            Iniciar sesión
          </Button>
        </div>
      </form>
    </div>
  )
}
