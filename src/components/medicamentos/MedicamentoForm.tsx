import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    medicamentoSchema,
    type MedicamentoFormData,
} from '@/forms/schemas/medicamentoSchema'

type MedicamentoFormProps = {
    defaultValues?: Partial<MedicamentoFormData>
}

export default function MedicamentoForm({
    defaultValues,
}: MedicamentoFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<MedicamentoFormData>({
        resolver: zodResolver(medicamentoSchema) as any,
        mode: 'onChange',
        defaultValues,
    })

    const onSubmit = async (
        data: MedicamentoFormData
    ) => {
        setIsLoading(true)

        await new Promise((resolve) =>
            setTimeout(resolve, 1500)
        )

        console.log(data)

        alert('Medicamento guardado correctamente')

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Nombre</label>

                <input
                    {...register('nombre')}
                    placeholder="Paracetamol"
                />

                {errors.nombre && (
                    <p>{errors.nombre.message}</p>
                )}
            </div>

            <div>
                <label>Principio activo</label>

                <input
                    {...register('principioActivo')}
                    placeholder="Paracetamol"
                />

                {errors.principioActivo && (
                    <p>
                        {errors.principioActivo.message}
                    </p>
                )}
            </div>

            <div>
                <label>Dosis (mg)</label>

                <input
                    type="number"
                    {...register('dosis', {
                        valueAsNumber: true,
                    })}
                />

                {errors.dosis && (
                    <p>{errors.dosis.message}</p>
                )}
            </div>

            <div>
                <label>Stock disponible</label>

                <input
                    type="number"
                    {...register('stock', {
                        valueAsNumber: true,
                    })}
                />

                {errors.stock && (
                    <p>{errors.stock.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={!isValid || isLoading}
            >
                {isLoading
                    ? 'Guardando...'
                    : 'Guardar medicamento'}
            </button>
        </form>
    )
}