import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

type Category = 'all' | 'understanding' | 'stages' | 'risks' | 'management' | 'warning';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  image: string;
  icon: string;
  color: string;
  category: Category;
  readTime: number;
  featured?: boolean;
}

const articles: Article[] = [
  {
    id: 'what-is-dr',
    title: 'What is Diabetic Retinopathy?',
    subtitle: 'Understanding the silent threat to your vision',
    content: [
      'Diabetic Retinopathy (DR) is a diabetes complication that affects your eyes. Think of it like pipes getting clogged - high blood sugar damages the tiny blood vessels in your retina.',
      'The retina is the light-sensitive tissue at the back of your eye. When these blood vessels leak or become blocked, your vision can be affected.',
      'The scary part? You might not notice symptoms until significant damage has occurred. That\'s why regular eye screenings are crucial for anyone with diabetes.',
    ],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    icon: 'eye',
    color: '#2D9596',
    category: 'understanding',
    readTime: 3,
    featured: true,
  },
  {
    id: 'the-silent-disease',
    title: 'The Silent Disease',
    subtitle: 'Why you can\'t feel DR developing',
    content: [
      'DR is completely painless in its early stages. Your eyes won\'t hurt, and your vision might seem perfectly normal.',
      'By the time you notice blurry vision or floaters, the disease may already be advanced. This is why it\'s called the "silent" disease.',
      'Regular eye exams are your only defense. Even if your vision seems fine, get screened annually if you have diabetes.',
    ],
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
    icon: 'volume-mute',
    color: '#FF3B30',
    category: 'understanding',
    readTime: 2,
  },
  {
    id: 'statistics',
    title: 'The Numbers Don\'t Lie',
    subtitle: 'Eye-opening statistics about DR',
    content: [
      '1 in 3 people with diabetes will develop diabetic retinopathy in their lifetime.',
      'DR is the leading cause of vision loss in working-age adults (20-74 years old).',
      'Early detection and treatment can prevent 95% of vision loss from DR.',
      'After 20 years of diabetes, nearly all Type 1 diabetics and 60% of Type 2 diabetics will have some degree of retinopathy.',
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    icon: 'bar-chart',
    color: '#34A853',
    category: 'understanding',
    readTime: 2,
  },
  {
    id: 'four-stages',
    title: 'The 4 Stages of DR',
    subtitle: 'From mild to sight-threatening',
    content: [
      'Mild: Tiny bulges (microaneurysms) appear in blood vessels. No symptoms yet.',
      'Moderate: Blood vessels swell and distort. The retina may lose blood supply.',
      'Severe: Many blood vessels are blocked. New abnormal vessels begin to grow.',
      'Proliferative: Advanced stage with fragile new vessels that can bleed and cause severe vision loss.',
    ],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    icon: 'swap-vertical',
    color: '#F9A826',
    category: 'stages',
    readTime: 4,
    featured: true,
  },
  {
    id: 'can-it-reverse',
    title: 'Can DR Be Reversed?',
    subtitle: 'Understanding your treatment options',
    content: [
      'Early stages (Mild/Moderate): Can be stabilized or even improved with tight blood sugar control.',
      'Severe stage: Damage is mostly permanent, but progression can be slowed.',
      'Proliferative stage: Requires immediate treatment to prevent blindness. Laser therapy and injections can save remaining vision.',
      'The key message: Catch it early, control your diabetes, and you can prevent most vision loss.',
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    icon: 'refresh',
    color: '#2D9596',
    category: 'stages',
    readTime: 3,
  },
  {
    id: 'blood-sugar',
    title: 'Blood Sugar: The Main Culprit',
    subtitle: 'Why HbA1c levels matter',
    content: [
      'Each 1% reduction in HbA1c reduces your DR risk by about 40%. That\'s huge!',
      'Target HbA1c: Below 7% for most people (your doctor may set different goals).',
      'Keeping blood sugar stable (avoiding spikes and crashes) is just as important as keeping it low.',
      'Use a glucose monitor, track patterns, and work with your healthcare team to optimize control.',
    ],
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800',
    icon: 'pulse',
    color: '#2D9596',
    category: 'risks',
    readTime: 3,
    featured: true,
  },
  {
    id: 'time-factor',
    title: 'Duration of Diabetes Matters',
    subtitle: 'How years affect your risk',
    content: [
      'After 5 years with diabetes: 25% have some degree of DR',
      'After 10 years: 60% have DR',
      'After 15 years: 80% have DR',
      'After 20+ years: Nearly everyone has some retinopathy',
      'This doesn\'t mean you\'re doomed - it means screening and control are essential!',
    ],
    image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800',
    icon: 'time',
    color: '#FF3B30',
    category: 'risks',
    readTime: 2,
  },
  {
    id: 'lifestyle-tips',
    title: 'Daily Habits That Protect Your Eyes',
    subtitle: 'Simple changes, big impact',
    content: [
      'Monitor blood sugar: Check regularly and log results to identify patterns.',
      'Eat smart: Choose low-GI foods, vegetables, lean protein. Avoid sugary drinks.',
      'Move more: 30 minutes of moderate exercise, 5 days a week. Walking counts!',
      'Take meds on time: Set phone reminders. Never skip doses.',
      'Sleep well: Aim for 7-9 hours. Poor sleep raises blood sugar.',
      'Manage stress: Try meditation, yoga, or deep breathing exercises.',
    ],
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    icon: 'checkmark-circle',
    color: '#34A853',
    category: 'management',
    readTime: 4,
  },
  {
    id: 'emergency-signs',
    title: '🚨 Emergency Symptoms',
    subtitle: 'When to call 911',
    content: [
      'Sudden, complete vision loss in one or both eyes',
      'Sudden shower of floaters (like seeing hundreds of gnats)',
      'Flashes of light that don\'t go away',
      'Dark curtain or veil covering part of your vision',
      'Severe eye pain with vision changes',
      'Don\'t wait - call 911 or go to the ER immediately!',
    ],
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
    icon: 'alert-circle',
    color: '#FF3B30',
    category: 'warning',
    readTime: 2,
    featured: true,
  },
  {
    id: 'contact-doctor',
    title: 'Warning Signs - Call Your Doctor',
    subtitle: 'Don\'t ignore these symptoms',
    content: [
      'New floaters appearing (a few dark spots)',
      'Gradual blurring that doesn\'t improve with blinking',
      'Difficulty reading or recognizing faces',
      'Seeing halos around lights',
      'Persistent double vision',
      'Contact your eye doctor the same day. Don\'t wait for your next scheduled appointment.',
    ],
    image: 'https://images.unsplash.com/photo-1609188076864-c35269136ce2?w=800',
    icon: 'warning',
    color: '#FF9500',
    category: 'warning',
    readTime: 3,
  },
];

export default function EducationScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories: { key: Category; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'understanding', label: 'Basics', icon: 'school' },
    { key: 'stages', label: 'Stages', icon: 'swap-vertical' },
    { key: 'risks', label: 'Risks', icon: 'warning' },
    { key: 'management', label: 'Tips', icon: 'checkmark' },
    { key: 'warning', label: 'Urgent', icon: 'alert-circle' },
  ];

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const featuredArticles = articles.filter(a => a.featured);

  if (selectedArticle) {
    return (
      <ScrollView style={styles.container}>
        {/* Article Hero Image */}
        <View style={styles.articleHero}>
          <Image 
            source={{ uri: selectedArticle.image }} 
            style={styles.articleHeroImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.articleHeroGradient}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedArticle(null)}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Article Content */}
        <View style={styles.articleContent}>
          <View style={styles.articleMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: selectedArticle.color }]}>
              <Ionicons name={selectedArticle.icon as any} size={14} color="#fff" />
              <Text style={styles.categoryBadgeText}>
                {categories.find(c => c.key === selectedArticle.category)?.label}
              </Text>
            </View>
            <View style={styles.readTime}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.readTimeText}>{selectedArticle.readTime} min read</Text>
            </View>
          </View>

          <Text style={styles.articleTitle}>{selectedArticle.title}</Text>
          <Text style={styles.articleSubtitle}>{selectedArticle.subtitle}</Text>

          <View style={styles.articleBody}>
            {selectedArticle.content.map((paragraph, index) => (
              <View key={index} style={styles.paragraphContainer}>
                <View style={styles.bulletDot} />
                <Text style={styles.paragraph}>{paragraph}</Text>
              </View>
            ))}
          </View>

          {/* Share & Bookmark */}
          <View style={styles.articleActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="bookmark-outline" size={24} color="#2D9596" />
              <Text style={styles.actionBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={24} color="#2D9596" />
              <Text style={styles.actionBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2D9596', '#3AAFB0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Learn About DR</Text>
          <Text style={styles.headerSubtitle}>Your guide to understanding diabetic retinopathy</Text>
        </View>
      </LinearGradient>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.tab,
              activeCategory === cat.key && styles.tabActive,
            ]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Ionicons
              name={cat.icon as any}
              size={16}
              color={activeCategory === cat.key ? '#fff' : '#2D9596'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeCategory === cat.key && styles.tabLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Articles - Only show in 'all' view */}
      {activeCategory === 'all' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Articles</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {featuredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.featuredCard}
                onPress={() => setSelectedArticle(article)}
                activeOpacity={0.9}
              >
                <Image 
                  source={{ uri: article.image }} 
                  style={styles.featuredImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={styles.featuredGradient}
                >
                  <View style={[styles.featuredBadge, { backgroundColor: article.color }]}>
                    <Ionicons name={article.icon as any} size={12} color="#fff" />
                  </View>
                  <Text style={styles.featuredTitle}>{article.title}</Text>
                  <Text style={styles.featuredSubtitle}>{article.subtitle}</Text>
                  <View style={styles.featuredMeta}>
                    <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.featuredReadTime}>{article.readTime} min</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Articles Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {activeCategory === 'all' ? 'All Articles' : categories.find(c => c.key === activeCategory)?.label}
        </Text>
        <View style={styles.articlesGrid}>
          {filteredArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              onPress={() => setSelectedArticle(article)}
              activeOpacity={0.9}
            >
              <Image 
                source={{ uri: article.image }} 
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <View style={[styles.cardBadge, { backgroundColor: article.color }]}>
                  <Ionicons name={article.icon as any} size={12} color="#fff" />
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{article.title}</Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>{article.subtitle}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.cardReadTime}>
                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                    <Text style={styles.cardReadTimeText}>{article.readTime} min</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#2D9596" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={16} color="#6B7280" />
        <Text style={styles.disclaimerText}>
          This educational content is for informational purposes. Always consult your healthcare provider.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EFEF',
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#2D9596',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D9596',
  },
  tabLabelActive: {
    color: '#fff',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  featuredContainer: {
    paddingRight: 16,
    gap: 16,
  },
  featuredCard: {
    width: width * 0.75,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 60,
  },
  featuredBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredReadTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  articlesGrid: {
    gap: 16,
    paddingBottom: 24,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E8EFEF',
  },
  cardContent: {
    padding: 16,
  },
  cardBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardReadTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardReadTimeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Article Detail Styles
  articleHero: {
    height: 300,
    position: 'relative',
  },
  articleHeroImage: {
    width: '100%',
    height: '100%',
  },
  articleHeroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 34,
    marginBottom: 8,
  },
  articleSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  articleBody: {
    gap: 16,
    marginBottom: 32,
  },
  paragraphContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D9596',
    marginTop: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 24,
    flex: 1,
  },
  articleActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E8EFEF',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D9596',
  },
  disclaimer: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: '#F9A826',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    flex: 1,
  },
});
