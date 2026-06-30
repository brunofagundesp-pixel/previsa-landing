import { Component, HostListener } from '@angular/core';
import { BetaService } from './core/services/beta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form = { name: '', email: '', agreed: false };
  submitting = false;
  submitted = false;
  errorMessage = '';
  activeFaq: number | null = null;
  showScrollTop = false;

  readonly faqs = [
    { q: 'O Previsa é gratuito?', a: 'Sim, durante o Beta Fechado o acesso é totalmente gratuito. Não há cobrança durante essa fase.' },
    { q: 'O Beta é limitado?', a: 'Sim, estamos selecionando um grupo limitado de usuários para testar e ajudar a melhorar o produto antes do lançamento oficial.' },
    { q: 'Quando receberei acesso?', a: 'Após o cadastro, entraremos em contato por e-mail caso você seja selecionado. O prazo pode variar de acordo com a demanda.' },
    { q: 'Preciso informar cartão?', a: 'Não. Durante o Beta Fechado nenhum dado de pagamento é solicitado.' },
    { q: 'Posso cancelar quando quiser?', a: 'Sim. Basta nos enviar um e-mail solicitando a remoção dos seus dados.' }
  ];

  constructor(private beta: BetaService) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.showScrollTop = window.scrollY > 600;
  }

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async submit(): Promise<void> {
    if (!this.form.name || !this.form.email || !this.form.agreed) {
      this.errorMessage = 'Preencha todos os campos e aceite os termos.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    try {
      await this.beta.apply({
        name: this.form.name,
        email: this.form.email
      });
      this.submitted = true;
    } catch (err: any) {
      this.errorMessage = err?.message ?? 'Erro ao enviar cadastro. Tente novamente.';
    } finally {
      this.submitting = false;
    }
  }
}
