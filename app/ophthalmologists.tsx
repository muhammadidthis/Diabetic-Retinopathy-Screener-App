import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Ophthalmologist {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  distance: number;
  rating: number;
  phone: string;
  email: string;
  address: string;
  availability: string;
}

// Mock data - In production, this would come from an API with real location data
const mockOphthalmologists: Ophthalmologist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Ahmed',
    specialization: 'Retinal Specialist',
    hospital: 'City Medical Center',
    distance: 2.3,
    rating: 4.8,
    phone: '+1-555-0101',
    email: 'sarah.ahmed@citymedical.com',
    address: '123 Medical Ave, City Center',
    availability: 'Mon-Fri: 9AM-5PM'
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    specialization: 'Ophthalmology',
    hospital: 'St. Vincent Hospital',
    distance: 3.5,
    rating: 4.6,
    phone: '+1-555-0102',
    email: 'james.wilson@stvincenthospital.com',
    address: '456 Healthcare Blvd, Downtown',
    availability: 'Tue-Sat: 10AM-6PM'
  },
  {
    id: '3',
    name: 'Dr. Maria Garcia',
    specialization: 'Diabetic Retinopathy Expert',
    hospital: 'Metropolitan Eye Care',
    distance: 4.1,
    rating: 4.9,
    phone: '+1-555-0103',
    email: 'maria.garcia@meteyecare.com',
    address: '789 Vision Lane, North District',
    availability: 'Mon-Thu: 8AM-4PM'
  },
  {
    id: '4',
    name: 'Dr. Robert Chen',
    specialization: 'Ophthalmology',
    hospital: 'Westside Health Clinic',
    distance: 5.2,
    rating: 4.7,
    phone: '+1-555-0104',
    email: 'robert.chen@westsideclinic.com',
    address: '321 Wellness St, West End',
    availability: 'Wed-Sun: 11AM-7PM'
  }
];

export default function OphthalmologistsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const severity = params.severity as string;
  const [doctors, setDoctors] = useState<Ophthalmologist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching nearby doctors based on user location
    setTimeout(() => {
      setDoctors(mockOphthalmologists);
      setLoading(false);
    }, 1000);
  }, []);

  const callDoctor = (phone: string, name: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', `Unable to call ${name}`);
    });
  };

  const emailDoctor = (email: string, name: string) => {
    Linking.openURL(`mailto:${email}?subject=DR Screening Result Consultation`).catch(() => {
      Alert.alert('Error', `Unable to email ${name}`);
    });
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.google.com/?q=${encodedAddress}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open maps');
    });
  };

  const getSeverityBadge = () => {
    const colors = {
      'No DR': '#34A853',
      'Mild': '#F9A826',
      'Moderate': '#FF9500',
      'Severe': '#FF3B30',
      'Proliferative DR': '#8B0000',
    };
    
    return colors[severity as keyof typeof colors] || '#2D9596';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2D9596', '#3AAFB0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Ophthalmologists</Text>
        </LinearGradient>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D9596" />
          <Text style={styles.loadingText}>Finding nearby specialists...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2D9596', '#3AAFB0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Ophthalmologists</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Severity Alert */}
        <View style={[styles.severityCard, { borderLeftColor: getSeverityBadge() }]}>
          <View style={styles.severityContent}>
            <Ionicons name="alert-circle" size={24} color={getSeverityBadge()} />
            <View style={styles.severityText}>
              <Text style={styles.severityLabel}>Your Result: {severity}</Text>
              <Text style={styles.severityDesc}>
                {severity !== 'No DR' 
                  ? 'We recommend consulting with an ophthalmologist.' 
                  : 'Regular eye checkups are still recommended.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctors List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Specialists</Text>
          <Text style={styles.sectionSubtitle}>{doctors.length} ophthalmologists found near you</Text>

          {doctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              {/* Doctor Header */}
              <View style={styles.doctorHeader}>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                </View>
              </View>

              {/* Hospital & Distance */}
              <View style={styles.doctorDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="hospital" size={16} color="#2D9596" />
                  <Text style={styles.detailText}>{doctor.hospital}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={16} color="#2D9596" />
                  <Text style={styles.detailText}>{doctor.distance} km away</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={16} color="#2D9596" />
                  <Text style={styles.detailText}>{doctor.availability}</Text>
                </View>
              </View>

              {/* Contact Methods */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { flex: 1, marginRight: 8 }]}
                  onPress={() => callDoctor(doctor.phone, doctor.name)}
                >
                  <Ionicons name="call" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { flex: 1, marginRight: 8 }]}
                  onPress={() => emailDoctor(doctor.email, doctor.name)}
                >
                  <Ionicons name="mail" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { flex: 1 }]}
                  onPress={() => openMaps(doctor.address)}
                >
                  <Ionicons name="map" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Map</Text>
                </TouchableOpacity>
              </View>

              {/* Full Address */}
              <View style={styles.addressBox}>
                <Text style={styles.addressLabel}>Address</Text>
                <Text style={styles.addressText}>{doctor.address}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsHeader}>
            <Ionicons name="information-circle" size={20} color="#2D9596" />
            <Text style={styles.tipsTitle}>Consultation Tips</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Bring your DR screening results to the appointment</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Schedule appointment as soon as possible if positive</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Ask about available treatment options</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Discuss prevention strategies for future visits</Text>
          </View>
        </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    padding: 16,
    gap: 20,
    paddingBottom: 32,
  },
  severityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  severityContent: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  severityText: {
    flex: 1,
    justifyContent: 'center',
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  severityDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  doctorSpec: {
    fontSize: 13,
    color: '#2D9596',
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(45, 149, 150, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D9596',
  },
  doctorDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2D9596',
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addressBox: {
    backgroundColor: 'rgba(45, 149, 150, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  addressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#1A1A1A',
    lineHeight: 18,
  },
  tipsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  tipItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 14,
    color: '#2D9596',
    fontWeight: '700',
  },
  tipText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    lineHeight: 18,
  },
});
