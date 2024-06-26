import { useAuth } from '@/context/AuthContext'
import { useLoginMutation } from '@/services/auth/login'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AtSign, Key, SendHorizonal, SquareLibrary } from 'lucide-react'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PulseLoader } from 'react-spinners'
import { toast } from '@/components/ui/use-toast'

export const LoginFormSchema = z.object({
    email: z.string({
        required_error: 'E-mail é obrigatório'
    }),
    password: z.string({
        required_error: 'Senha é obrigatória'
    })
})

export function LoginPage() {
    const { mutate, isPending } = useLoginMutation()
    const { user } = useAuth()
    console.log(user)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true })
        }
    }, [])

    const handleLogin = (values: z.infer<typeof LoginFormSchema>) => {
        mutate(values, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Sucesso!',
                    description: 'Login realizado com sucesso.'
                })
                navigate('/', { replace: true })
            },
            onError: (error) => {
                console.log(error)
                toast({
                    variant: 'destructive',
                    title: 'Erro!',
                    description: error.response?.data
                })
            }
        })
    }

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema)
    })

    return (
        <div className="flex min-h-screen flex-wrap justify-center block">
            <div className="w-full md:w-1/2  p-5 px-10 flex items-center justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="w-full lg:w-3/5">
                        <h1 className="text-2xl flex items-center gap-3 relative left-[-3px] font-semibold mb-2">
                            <SquareLibrary size={32} className="text-blue-600 inline" />
                            Olá estudante!
                        </h1>
                        <h2 className="mb-5 text-sm text-slate-600">
                            Realize o login abaixo para acessar uma variedade de desafios e questões para testar suas
                            habilidades.
                        </h2>
                        <span className="text-2xl font-bold mb-3 block">Login</span>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Seu e-mail</FormLabel>
                                    <div className="flex">
                                        <Input
                                            value={field.value}
                                            onChange={field.onChange}
                                            type="email"
                                            placeholder="E-mail"
                                            className="rounded-e-none h-11"
                                        />
                                        <span className="border w-12 h-11 border-s-0 rounded-e-md px-1 flex items-center justify-center">
                                            <AtSign size={14} />
                                        </span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>Sua senha</FormLabel>
                                    <div className="flex">
                                        <Input
                                            value={field.value}
                                            onChange={field.onChange}
                                            type="password"
                                            placeholder="******"
                                            className="rounded-e-none h-11"
                                        />
                                        <span className="border w-12 h-11 border-s-0 rounded-e-md px-1 flex items-center justify-center">
                                            <Key size={14} />
                                        </span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant={'primary'} size={'lg'} className="mt-6 w-full">
                            {!isPending && (
                                <span className="flex items-center">
                                    Fazer Login <SendHorizonal className="ms-5" size={20} />
                                </span>
                            )}
                            {isPending && <PulseLoader color="#fff" size={8} />}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="w-1/2 hidden md:block min-h-screen bg-[linear-gradient(to_right_bottom,rgba(44,59,84,0.8),rgba(16,32,71,0.8)),url('/login-bg.jpg')]"></div>
        </div>
    )
}
