import HeroEditorial from "@/components/HeroEditorial";
import FeatureSplit from "@/components/FeatureSplit";
import StaggeredGallery from "@/components/StaggeredGallery";
import ScrollReveal from "@/components/ScrollReveal";
import AppDownload from "@/components/AppDownload";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  const galleryImages = [
    '/photo02.jpeg',
    '/photo03.jpeg',
    '/photo04.jpeg',
    '/photo05.jpeg',
    '/photo06.jpeg',
  ];

  return (
    <main className="min-h-screen">
      <HeroEditorial 
        title="Building the Future of African Education"
        subtitle="A comprehensive infrastructure for modern learning, assessment, and academic intelligence."
        image="/photo01.jpeg"
        ctaText="Get Started"
        ctaLink="/onboard"
      />

      {/* SchoolHub Section */}
      <FeatureSplit 
        title="SchoolHub"
        description="Power up your school, from Admission, Transformation, through Graduation. Access ExamsPRO, ClassroomPRO, ResultsPRO and TutorsPRO all from one Mobile-First Digital Campus experience."
        imageMain="/photo13.jpeg"
        imageSecondary="/photo11.jpeg"
        linkText="Launch Digital Campus"
      />

      {/* ExamsPRO Section */}
      <FeatureSplit 
        title="ExamsPRO"
        description="Gamify external examination preparation with borderless competition and a readiness tracker. Prepare students intentionally with an advanced CBT engine."
        imageMain="/photo03.jpeg"
        imageSecondary="/photo05.jpeg"
        reverse
        linkText="Explore ExamsPRO"
      />

      <section className="section section-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center mission-grid" style={{ gap: 'var(--space-lg)' }}>
            <div>
              <ScrollReveal animation="fade-up">
                <span className="caption">Our Mission</span>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={200}>
                <h2 className="mt-[var(--space-sm)]">To Prepare Africa for Takeover.</h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={400}>
                <p>To provoke specific achievable change in how African parents and schools approach K12 education.</p>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="slide-left">
              <div className="border-l-2 border-sky-blue" style={{ padding: 'var(--space-md)', paddingLeft: 'var(--space-md)' }}>
                <p style={{ fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--color-text-on-white)', textShadow: 'none', lineHeight: '1.6' }}>
                  &ldquo;From the parent's seat at the kitchen table, through the teacher's classroom, the exam hall, the report card, the tutor's screen, the principal's office, the household's accountability, the digital future and the continent's urgency, we are building an infrastructure to power the needed culture shift.&rdquo;
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ClassroomPRO Section */}
      <FeatureSplit 
        title="ClassroomPRO"
        description="Provide structured resources for classroom and after-school engagement with key performance insights for parents. Keep learning moving with an offline-first digital classroom."
        imageMain="/photo02.jpeg"
        imageSecondary="/photo04.jpeg"
        linkText="Discover ClassroomPRO"
      />

      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 className="text-center mb-[var(--space-xl)] text-white">Innovation in Action</h2>
          </ScrollReveal>
          <StaggeredGallery images={galleryImages} />
        </div>
      </section>

      <Testimonials />

      {/* TutorsPRO Section */}
      <FeatureSplit 
        title="TutorsPRO"
        description="Find and provide vetted, top-rated, curriculum-aligned tuition for kids abroad. Connect students with academic support through real-time collaboration tools."
        imageMain="/photo06.jpeg"
        imageSecondary="/photo07.jpeg"
        reverse
        linkText="Join TutorsPRO"
      />

      {/* ResultsPRO Section */}
      <FeatureSplit 
        title="ResultsPRO"
        description="Reduce processing time to zero, generate AI-powered performance insights and monetize end-of-term results delivery at scale. Transform examination data into actionable intelligence."
        imageMain="/photo08.jpeg"
        imageSecondary="/photo10.jpeg"
        linkText="Explore ResultsPRO"
      />

      <AppDownload />

      <section className="section section-white" style={{ paddingBottom: 'var(--space-lg)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <ScrollReveal animation="fade-up">
            <span className="caption">Partnership Open</span>
            <h2 style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>Start Your Journey Today</h2>
            <a href="/onboard" className="btn btn-primary">Get Started Now</a>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
