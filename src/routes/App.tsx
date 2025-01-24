import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { useAuth } from '../lib/useAuth'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { TrashIcon } from 'lucide-react'

const validationSchema = yup.object({
  nombre: yup.string().required(),
  cantidad: yup.number().required(),
  unidad: yup.string().required(),
  peso: yup.number().required(),
})

export function App() {
  const queryClient = useQueryClient()
  const { signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const formik = useFormik({
    initialValues: {
      nombre: '',
      cantidad: 0,
      unidad: '',
      peso: 0,
    },
    onSubmit: async (values) => {
      const toastId = toast.loading('Cargando...')
      const formData = new FormData()
      formData.append('nombre', values.nombre)
      formData.append('idUnidad', values.unidad)
      formData.append('cantidad', String(values.cantidad))
      formData.append('peso', String(values.peso))
      const token = localStorage.getItem('token')

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/producto/guardar`,
        {
          method: 'POST',
          body: formData,
          headers: { Authorization: String(token) },
        },
      )

      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success('¡Producto agregado!', { id: toastId })
        setIsOpen(false)
        formik.resetForm()
      } else {
        toast.error('Error al agregar producto', { id: toastId })
      }
    },
    validationSchema,
  })

  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tipo-embalaje/listado`,
        {
          headers: { Authorization: String(localStorage.getItem('token')) },
        },
      )

      if (res.ok) {
        return res.json()
      }
    },
  })

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/producto/listado`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      )

      if (res.ok) {
        return res.json()
      }
    },
  })

  const { mutate: deleteProduct } = useMutation({
    mutationFn: async (id: string) => {
      const toastId = toast.loading('Eliminando...')

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/producto/eliminar?id=${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: localStorage.getItem('token') as string },
        },
      )

      if (res.ok) {
        toast.success('¡Producto eliminado!', { id: toastId })
        queryClient.invalidateQueries({ queryKey: ['products'] })
      } else {
        toast.error('Error al eliminar producto', { id: toastId })
      }
    },
  })

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <div className="flex justify-end gap-4">
        <Button onClick={() => setIsOpen(true)}>Agregar producto</Button>
        <Button onClick={signOut}>Cerrar sesión</Button>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Agregar producto</DialogTitle>

        <DialogContent>
          <form
            className="flex max-w-xl flex-col gap-4 p-2"
            onSubmit={formik.handleSubmit}
          >
            <TextField
              label="Nombre"
              name="nombre"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nombre}
              variant="filled"
            />

            <TextField
              label="Cantidad"
              type="number"
              name="cantidad"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cantidad}
              variant="filled"
            />

            <FormControl fullWidth variant="filled">
              <InputLabel id="label-unidad">Unidad</InputLabel>
              <Select
                name="unidad"
                labelId="label-unidad"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.unidad}
              >
                {packages?.map((pkg: { id: string; nombre: string }) => (
                  <MenuItem key={pkg.id} value={pkg.id}>
                    {pkg.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Peso"
              name="peso"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              value={formik.values.peso}
              variant="filled"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">KG</InputAdornment>
                  ),
                },
              }}
            />

            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>

      <h2 className="text-lg font-bold">Productos</h2>

      <div className="flex flex-col gap-2">
        {products?.map(
          (product: {
            id: string
            nombre: string
            cantidad: number
            peso: number
          }) => (
            <div
              className="relative rounded-md border p-4 shadow"
              key={product.id}
            >
              <div>
                <b>Nombre </b>
                {product.nombre}
              </div>
              <div>
                <b>Cantidad </b>
                {product.cantidad}
              </div>
              <div>
                <b>Peso </b>
                {product.peso}
              </div>

              <div className="absolute right-2 top-2">
                <IconButton
                  color="warning"
                  onClick={() => deleteProduct(product.id)}
                >
                  <TrashIcon size={20} />
                </IconButton>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
